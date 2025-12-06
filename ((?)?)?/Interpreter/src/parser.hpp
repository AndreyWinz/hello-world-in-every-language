#pragma once
#include <istream>
#include <stdexcept>
#include <string>
#include "tree.hpp"

namespace qqq
{
    class syntax_error : public std::runtime_error
    {
        std::string input_name;
        size_t line, column;

        static std::string format_pos(const std::string& input_name, size_t line, size_t column)
        {
            return input_name + ':' + std::to_string(line) + ':' + std::to_string(column) + ": ";
        }
    public:
        syntax_error(const std::string& input_name, size_t line, size_t column, const std::string& msg) : std::runtime_error(format_pos(input_name, line, column) + msg), input_name(input_name), line(line), column(column) {}
        syntax_error(const std::string& input_name, size_t line, size_t column, const char* msg) : std::runtime_error(format_pos(input_name, line, column) + msg), input_name(input_name), line(line), column(column) {}

        const std::string& get_input_name() const noexcept { return input_name; }
        size_t get_line() const noexcept { return line; }
        size_t get_column() const noexcept { return column; }
    };

    std::unique_ptr<tree::expression> parse(std::istream&, const std::string& filename);
}
