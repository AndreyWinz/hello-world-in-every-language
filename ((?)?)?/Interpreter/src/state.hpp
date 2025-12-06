#pragma once
#include <vector>
#include <unordered_map>
#include <concepts>

namespace qqq
{
    struct state
    {
        bool bit = false;
        std::vector<bool> stack;
        std::unordered_map<char, bool> vars;

        template<typename IntT>
            requires std::integral<IntT> || std::is_enum_v<IntT>
        IntT read_from_stack() const
        {
            IntT result{0};
            const unsigned num_bits = (unsigned)std::min(stack.size(), 8*sizeof(IntT));
            for (unsigned bit = 0; bit < num_bits; bit++) {
                if (stack[stack.size() - bit - 1]) {
                    if constexpr (std::is_enum_v<IntT>) {
                        using UnderlyingT = std::underlying_type_t<IntT>;
                        result = IntT{UnderlyingT{result} | (UnderlyingT{1} << (num_bits - bit - 1))};
                    } else {
                        result |= IntT{1} << (num_bits - bit - 1);
                    }
                }
            }
            return result;
        }

        template<std::integral IntT, unsigned num_bits = 8*sizeof(IntT)> requires (num_bits <= 8*sizeof(IntT))
        void push_to_stack(IntT value)
        {
            for (unsigned bit = 0; bit < num_bits; bit++) {
                stack.push_back((value >> bit) & 1);
            }
        }
    };
}
