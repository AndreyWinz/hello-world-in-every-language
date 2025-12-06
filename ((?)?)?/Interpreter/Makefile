WARNINGS = -Wall -Wno-parentheses -Wno-unused-label
STD = -std=c++2a
CXXFLAGS += $(STD) $(WARNINGS)
CXXFLAGS += -g -O0
CXXFLAGS += -MMD

EXECUTABLE = qqq

HDRS := $(wildcard src/*.hpp)
SRCS := $(wildcard src/*.cpp)
OBJS := $(SRCS:src/%.cpp=bin/%.o)

$(EXECUTABLE): $(OBJS)
	$(CXX) -std=c++2a -o $@ $(OBJS) $(LDFLAGS)

-include $(wildcard bin/*.d)

bin/%.o: src/%.cpp
	$(CXX) $(CXXFLAGS) $(CPPFLAGS) -c $< -o $@

.PHONY: clean
clean:
	rm -rf $(EXECUTABLE).exe *.gch *.stackdump bin/*
