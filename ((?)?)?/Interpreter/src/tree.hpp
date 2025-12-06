#pragma once
#include <memory>
#include <vector>

namespace qqq::tree
{
    struct visitor;

    struct expression
    {
        virtual ~expression() = default;
        virtual void accept(visitor&) const = 0;
    };

    struct nor;
    struct toggle;
    struct set_variable;
    struct get_variable;
    struct push;
    struct pop;
    struct has_elements;
    struct while_loop;
    struct out_num;
    struct out_char;
    struct out_bit;
    struct input_num;
    struct input_char;
    struct input_bit;
    struct print_newline;
    struct group;

    struct visitor
    {
        virtual ~visitor() = default;
        virtual void visit(const nor&) = 0;
        virtual void visit(const toggle&) = 0;
        virtual void visit(const set_variable&) = 0;
        virtual void visit(const get_variable&) = 0;
        virtual void visit(const push&) = 0;
        virtual void visit(const pop&) = 0;
        virtual void visit(const has_elements&) = 0;
        virtual void visit(const while_loop&) = 0;
        virtual void visit(const out_num&) = 0;
        virtual void visit(const out_char&) = 0;
        virtual void visit(const out_bit&) = 0;
        virtual void visit(const input_num&) = 0;
        virtual void visit(const input_char&) = 0;
        virtual void visit(const input_bit&) = 0;
        virtual void visit(const print_newline&) = 0;
        virtual void visit(const group&) = 0;
    };

    struct nor : expression
    {
        std::unique_ptr<expression> rhs;

        nor(std::unique_ptr<expression>&& rhs) : rhs(move(rhs)) {}

        virtual void accept(visitor& v) const override { v.visit(*this); }
    };

    struct toggle : expression
    {
        virtual void accept(visitor& v) const override { v.visit(*this); }
    };

    struct set_variable : expression
    {
        char name;

        set_variable(char name) : name(name) {}

        virtual void accept(visitor& v) const override { v.visit(*this); }
    };

    struct get_variable : expression
    {
        char name;

        get_variable(char name) : name(name) {}

        virtual void accept(visitor& v) const override { v.visit(*this); }
    };

    struct push : expression
    {
        virtual void accept(visitor& v) const override { v.visit(*this); }
    };

    struct pop : expression
    {
        virtual void accept(visitor& v) const override { v.visit(*this); }
    };

    struct has_elements : expression
    {
        virtual void accept(visitor& v) const override { v.visit(*this); }
    };

    struct while_loop : expression
    {
        std::vector<std::unique_ptr<expression>> body;

        while_loop(std::vector<std::unique_ptr<expression>>&& body) : body(move(body)) {}

        virtual void accept(visitor& v) const override { v.visit(*this); }
    };

    struct out_num : expression
    {
        virtual void accept(visitor& v) const override { v.visit(*this); }
    };

    struct out_char : expression
    {
        virtual void accept(visitor& v) const override { v.visit(*this); }
    };

    struct out_bit : expression
    {
        virtual void accept(visitor& v) const override { v.visit(*this); }
    };

    struct input_num : expression
    {
        virtual void accept(visitor& v) const override { v.visit(*this); }
    };

    struct input_char : expression
    {
        virtual void accept(visitor& v) const override { v.visit(*this); }
    };

    struct input_bit : expression
    {
        virtual void accept(visitor& v) const override { v.visit(*this); }
    };

    struct print_newline : expression
    {
        virtual void accept(visitor& v) const override { v.visit(*this); }
    };

    struct group : expression
    {
        std::vector<std::unique_ptr<expression>> body;

        group(std::vector<std::unique_ptr<expression>>&& body) : body(move(body)) {}

        virtual void accept(visitor& v) const override { v.visit(*this); }
    };
}
