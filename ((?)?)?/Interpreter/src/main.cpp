#include <vector>
#include <string>
#include <iostream>
#include <fstream>
#include "parser.hpp"
#include "evaluator.hpp"

int main(int argc, const char* argv[])
{
    if (argc < 2) {
        std::cerr << "Missing filename argument.\n";
        return EXIT_FAILURE;
    }
    std::unique_ptr<qqq::tree::expression> expr;
    {
        std::ifstream input(argv[1]);
        expr = qqq::parse(input, argv[1]);
    }
    std::cout << "parsed\n";
    qqq::state state;
    qqq::eval(*expr, state);
    return EXIT_SUCCESS;
}
