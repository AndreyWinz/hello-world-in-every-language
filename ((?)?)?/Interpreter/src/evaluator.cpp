#include <cstdint>
#include <iostream>
#include "evaluator.hpp"

namespace qqq
{
    struct evaluator : tree::visitor
    {
        state& state;

        evaluator(qqq::state& state) : state(state) {}

        virtual void visit(const tree::nor& e)
        {
            bool result0 = state.bit;
            state.bit = false;
            if (e.rhs) {
                e.rhs->accept(*this);
            }
            state.bit = !result0 && !state.bit;
        }
        virtual void visit(const tree::toggle& e)
        {
            state.bit = !state.bit;
        }
        virtual void visit(const tree::set_variable& e)
        {
            state.vars[e.name] = state.bit;
        }
        virtual void visit(const tree::get_variable& e)
        {
            state.bit = state.vars[e.name];
        }
        virtual void visit(const tree::push& e)
        {
            state.stack.push_back(state.bit);
        }
        virtual void visit(const tree::pop& e)
        {
            state.bit = state.stack.back();
            state.stack.pop_back();
        }
        virtual void visit(const tree::has_elements& e)
        {
            state.bit = !state.stack.empty();
        }
        virtual void visit(const tree::while_loop& e)
        {
            while (state.bit) {
                for (auto& elem : e.body) {
                    elem->accept(*this);
                }
            }
        }
        virtual void visit(const tree::out_num& e)
        {
            std::cout << (unsigned int)state.read_from_stack<uint8_t>();
        }
        virtual void visit(const tree::out_char& e)
        {
            std::cout << state.read_from_stack<char>();
        }
        virtual void visit(const tree::out_bit& e)
        {
            std::cout << state.bit;
        }
        virtual void visit(const tree::input_num& e)
        {
            unsigned int value;
            std::cin >> value;
            state.push_to_stack((uint8_t)value);
        }
        virtual void visit(const tree::input_char& e)
        {
            char value;
            std::cin >> value;
            state.push_to_stack(value);
        }
        virtual void visit(const tree::input_bit& e)
        {
            std::cin >> state.bit;
        }
        virtual void visit(const tree::print_newline& e)
        {
            endl(std::cout);
        }
        virtual void visit(const tree::group& e)
        {
            state.bit = false;
            for (auto& elem : e.body) {
                elem->accept(*this);
            }
        }
    };

    void eval(const tree::expression& expr, state& state)
    {
        evaluator evaluator(state);
        expr.accept(evaluator);
    }
}
