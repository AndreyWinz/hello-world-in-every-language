#include <string_view>
#include "parser.hpp"

namespace qqq
{
    namespace { using namespace std::literals; }

    static constexpr bool isignored(int c)
    {
        switch (c) {
        case '?':
        case '(':
        case ')':
        case '!':
        case ':':
        case ';':
        case '@':
        case '#':
        case '_':
        case '[':
        case ']':
        case '=':
        case '~':
        case '-':
        case '$':
        case '%':
        case '&':
        case '/':
            return false;
        default:
            return true;
        }
    }

    struct parser
    {
        std::istream& in;
        std::string filename;
        size_t line = 1, column = 1;
        int ch = std::istream::traits_type::eof();
    
        parser(std::istream& in, const std::string& filename) : in(in), filename(filename)
        {
            ch = in.peek();
        }
        auto syntax_error(const std::string& msg) const
        {
            return qqq::syntax_error(filename, line, column, msg);
        }
        auto syntax_error(const char* msg) const
        {
            return qqq::syntax_error(filename, line, column, msg);
        }
        auto syntax_error(size_t line, size_t column, const std::string& msg) const
        {
            return qqq::syntax_error(filename, line, column, msg);
        }
        auto syntax_error(size_t line, size_t column, const char* msg) const
        {
            return qqq::syntax_error(filename, line, column, msg);
        }
        void skip()
        {
            switch (ch) {
            case '\r':
            case '\n':
                line++;
                column = 1;
                break;
            default:
                column++;
                break;
            }
            in.get();
            if ((ch = in.peek()) == '\r') {
                in.get();
                if (in.peek() == '\n') {
                    ch = '\n';
                    column++;
                } else {
                    in.unget();
                }
            }
        }
        bool eat(char c)
        {
            if (ch == EOF) {
                return false;
            }
            if ((unsigned char)ch == (unsigned char)c) {
                skip();
                return true;
            }
            return false;
        }
        bool eat(std::string_view str)
        {
            if (str.empty()) return true;
            if (str.length() == 1) return eat(str.front());
            auto mark = in.tellg();
            auto mark_ch = ch;
            auto mark_line = line;
            auto mark_column = column;
            for (char c : str) {
                if (!eat(c)) {
                    in.seekg(mark);
                    ch = mark_ch;
                    line = mark_line;
                    column = mark_column;
                    return false;
                }
            }
            return true;
        }
        void expect(char c)
        {
            if (!eat(c)) {
                throw syntax_error("expected '"s + c + '\'');
            }
        }
        void expect(std::string_view str)
        {
            if (!eat(str)) {
                std::string msg = "expected '"s;
                msg += str;
                msg += '\'';
                throw syntax_error(msg);
            }
        }
        void skip_ignored()
        {
            while (ch != EOF && isignored(ch)) {
                skip();
            }
        }
        std::unique_ptr<tree::expression> parse_single()
        {
            skip_ignored();
            switch (ch) {
            case '(':
            {
                skip();
                skip_ignored();
                std::vector<std::unique_ptr<tree::expression>> body;
                while (ch != EOF && ch != ')') {
                    body.push_back(parse_single());
                    skip_ignored();
                }
                expect(')');
                return std::make_unique<tree::group>(move(body));
            }
            case '[':
            {
                skip();
                skip_ignored();
                std::vector<std::unique_ptr<tree::expression>> body;
                while (ch != EOF && ch != ']') {
                    body.push_back(parse_single());
                    skip_ignored();
                }
                expect(']');
                return std::make_unique<tree::while_loop>(move(body));
            }
            case ':':
            {
                skip();
                if (ch == EOF) {
                    throw syntax_error("expected name");
                }
                char name = (unsigned char)ch;
                skip();
                return std::make_unique<tree::set_variable>(name);
            }
            case ';':
            {
                skip();
                if (ch == EOF) {
                    throw syntax_error("expected name");
                }
                char name = (unsigned char)ch;
                skip();
                return std::make_unique<tree::get_variable>(name);
            }
            case '?':
            {
                skip();
                skip_ignored();
                switch (ch) {
                case EOF:
                case ')':
                case ']':
                    return std::make_unique<tree::nor>(nullptr);
                default:
                    return std::make_unique<tree::nor>(parse_single());
                }
            }
            case '!':
            {
                skip();
                return std::make_unique<tree::toggle>();
            }
            case '@':
            {
                skip();
                return std::make_unique<tree::push>();
            }
            case '#':
            {
                skip();
                return std::make_unique<tree::pop>();
            }
            case '_':
            {
                skip();
                return std::make_unique<tree::has_elements>();
            }
            case '=':
            {
                skip();
                return std::make_unique<tree::out_num>();
            }
            case '~':
            {
                skip();
                return std::make_unique<tree::out_char>();
            }
            case '-':
            {
                skip();
                return std::make_unique<tree::out_bit>();
            }
            case '$':
            {
                skip();
                return std::make_unique<tree::input_num>();
            }
            case '%':
            {
                skip();
                return std::make_unique<tree::input_char>();
            }
            case '&':
            {
                skip();
                return std::make_unique<tree::input_bit>();
            }
            case '/':
            {
                skip();
                return std::make_unique<tree::print_newline>();
            }
            default:
                throw syntax_error("expected instruction character");
            }
        }
        
        // std::unique_ptr<tree::expression> parse()
        // {
        //     std::unique_ptr<tree::expression> result = parse_single();
        //     skip_ignored();
        //     while (eat('?')) {
        //         skip_ignored();
        //         switch (ch) {
        //         case ')':
        //         case ']':
        //             result = std::make_unique<tree::nor>(move(result), nullptr);
        //             break;
        //         default:
        //             result = std::make_unique<tree::nor>(move(result), parse());
        //         }
        //         skip_ignored();
        //     }
        //     return result;
        // }


    };

    std::unique_ptr<tree::expression> parse(std::istream& in, const std::string& filename)
    {
        parser parser(in, filename);
        std::unique_ptr<tree::expression> result = parser.parse_single();
        parser.skip_ignored();
        if (!in.eof()) {
            std::vector<std::unique_ptr<tree::expression>> body;
            body.push_back(move(result));
            do {
                body.push_back(parser.parse_single());
                parser.skip_ignored();
            } while (!in.eof());
            result = std::make_unique<tree::group>(move(body));
        }
        return result;
    }
}
