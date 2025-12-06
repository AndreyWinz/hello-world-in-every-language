/**
 * The code box class
 */
class CodeBox {
    constructor(codeBoxID, initialStackID, outputID) {
        /**
         * Possible vectors the pointer can move in
         * @type {Object}
         */
        this.directions = {
            NORTH:  [ 0, -1],
            EAST:   [ 1,  0],
            SOUTH:  [ 0,  1],
            WEST:   [-1,  0],
        };
        /**
         * The current vector of the pointer
         * @type {int[]}
         */
        this.curr_direction = this.directions.EAST;
        /**
         * The Set of instructions to execute
         * 
         * Either a 1 or 2-dimensional array
         * @type {Array|Array[]}
         */
        this.box = [];
        /**
         * The farthest right the box goes
         * @type {int}
         */
        this.maxBoxWidth = 0;
        /**
         * The bottom of the box
         * 
         * @type {int}
         */
        this.maxBoxHeight = 0;
        /**
         * The coordinates of the currently executing instruction inside the code box
         * @type {Object}
         */
        this.pointer = {
            X: 0,
            Y: 0,
        };
        /**
         * Was the instruction last moving in the left direction
         * 
         * Used by the {@link Fisherman}
         * @type {boolean}
         */
        this.dirWasLeft = false;
        /**
         * Are we currently under the influence of the {@link Fisherman}
         * @type {boolean}
         */
        this.onTheHook = false;
        /**
         * Have we dived using `u`
         *
         * Until rising with `O`, all instructions except movement and mirror instructions are ignored.
         * @type {boolean}
         */
        this.hasDove = false;
        /**
         * Constant of values to check when `this.hasDove == true`
         *
         * Includes `O` so that we can rise.
         *
         * @type {string[]}
         */
        this.MOVEMENT_AND_MIRRORS = [">", "<", "^", "v", "/", "\\", "|", "_", "#", "x", "`", "O"];
        /**
         * Are we currently processing code box instructions as a string
         *
         * 0 when false, otherwise it holds the char code for string delimiter, either
         * 34 or 39
         *
         * @type {int}
         */
        this.stringMode = 0;
        /**
         * A list of stacks for the script to work with
         *
         * @type {Stack[]}
         */
        this.stacks = [new Stack()];
        /**
         * The index of the currently used stack
         *
         * @type {int}
         */
        this.curr_stack = 0;
        /**
         * The current date
         * 
         * This value is updated every tick
         * @type {?Date}
         */
        this.datetime = null;
        /**
         * Assorted debug options
         *
         * @type {object}
         */
        this.debug = {
            print: {
                codeBox: false,
                stacks: false,
            }
        };

        this.codeBoxDOM = document.getElementById(codeBoxID);
        if(!this.codeBoxDOM) {
            throw new Error(`Failed to find textarea with ID: ${codeBoxID}`);
        }

        this.outputDOM = document.getElementById(outputID);
        if(!this.outputDOM) {
            throw new Error(`Failed to find textarea with ID: ${outputID}`);
        }

        this.initialStackDOM = document.getElementById(initialStackID);
        if(!this.initialStackDOM) {
            throw new Error(`Failed to find input with ID: ${initialStackID}`);
        }
    }

    /**
     * Parse the initial code box
     * 
     * Transforms the textual code box into usable matrix
     */
    ParseCodeBox() {
        // Reset some fields for a clean run
        this.box = [];
        this.stacks = [new Stack()];
        this.curr_stack = 0;
        this.pointer = {X: 0, Y: 0};
        this.curr_direction = this.directions.EAST;
        this.dirWasLeft = false;
        this.outputDOM.value = "";
        console.clear();

        // Set the debug values
        this.debug.print.codeBox = document.getElementById("debug-code-box")?.checked;
        this.debug.print.stacks = document.getElementById("debug-stacks")?.checked;

        const cbRaw = this.codeBoxDOM.value;
        const rows = cbRaw.split("\n");

        let maxRowLength = 0;
        for(const row of rows) {
            const rowSplit = row.split("");

            // Store this for later processing
            while(rowSplit.length > maxRowLength) {
                maxRowLength = rowSplit.length
            }

            this.box.push(rowSplit);
        }

        this.EqualizeBoxWidth(maxRowLength);

        this.maxBoxWidth = maxRowLength - 1;
        this.maxBoxHeight = this.box.length - 1;

        if (this.initialStackDOM.value != "") {
            this.ParseInitialStack();
        }

        this.Run();
    }

    /**
     * Parse the value provided for the stack at run time
     */
    ParseInitialStack() {
        const separator = /(["'].+?["']|\d+)/g;
        const stackValues = this.initialStackDOM.value.split(separator).filter((v) => v.trim().length);

        for (const val of stackValues) {
            const intVal = parseInt(val);
            if (!Number.isNaN(intVal)) {
                this.stacks[this.curr_stack].Push(intVal);
            }
            else {
                let chars = val.substr(1, val.length - 2).split('');
                chars = chars.map((c) => dec(c));
                this.stacks[this.curr_stack].Push(chars);
            }
        }
    }

    /** 
     * Prints the code box to the console
     */
    PrintCodeBox() {
        let output = "";
        for (let y = 0; y < this.box.length; y++) {
            for (let x = 0; x < this.box[y].length; x++) {
                let instruction = this.box[y][x];
                if (x == this.pointer.X && y == this.pointer.Y) {
                    instruction = `*${instruction}*`;
                }
                output += `${instruction} `;
            }
            output += "\n";
        }

        console.log(output);
    }

    /**
     * Prints all stacks to the console
     */
    PrintStacks() {
        let output = "{\n";

        for (let i = 0; i < this.stacks.length; i++) {
            output += `\t${i}: ${JSON.stringify(this.stacks[i].stack)},\n`
        }
        output += "}";

        console.log(output);
    }

    /**
     * Make all the rows in the code box the same length
     *
     * All rows not long enough will have NOPs added until they're uniform in size.
     *
     * @param {int} [rowLength] The longest row in the code box
     */
    EqualizeBoxWidth(rowLength = null) {
        if(!rowLength) {
            for(const row of this.box) {
                if(row.length > rowLength) {
                    rowLength = row.length;
                }
            }
        }

        for(const row of this.box) {
            while(row.length < rowLength) {
                row.push(" ");
            }
        }
    }

    /**
     * Print the value to the display 
     *
     * @TODO Set up an actual display
     * @param {*} value 
     */
    Output(value) {
        this.outputDOM.value += value;
    }

    /**
     * The main loop for the engine 
     */
    Run() {
        let fin = null;

        try {
            while(!fin) {
                fin = this.Swim();
            }
        }
        catch(e) {
            console.error(e);
        }
    }

    Execute(instruction) {
        let output = null;
        
        // Ignore non-movement and non-mirror instructions
        if (this.hasDove) {
            if (this.MOVEMENT_AND_MIRRORS.indexOf(instruction) < 0) {
                return output;
            }
        }
        
        try{
            switch(instruction) {
                // NOP
                case " ":
                    break;
                // Numbers
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                case "0":
                case "a":
                case "b":
                case "c":
                case "d":
                case "e":
                case "f":
                    this.stacks[this.curr_stack].Push(parseInt(instruction, 16));
                    break;
                // Operators
                case "+": {
                    const x = this.stacks[this.curr_stack].Pop();
                    const y = this.stacks[this.curr_stack].Pop();
                    this.stacks[this.curr_stack].Push(y + x);
                    break;
                }
                case "-": {
                    const x = this.stacks[this.curr_stack].Pop();
                    const y = this.stacks[this.curr_stack].Pop();
                    this.stacks[this.curr_stack].Push(y - x);
                    break;
                }
                case "*": {
                    const x = this.stacks[this.curr_stack].Pop();
                    const y = this.stacks[this.curr_stack].Pop();
                    this.stacks[this.curr_stack].Push(y * x);
                    break;
                }
                case ",": {
                    const x = this.stacks[this.curr_stack].Pop();
                    const y = this.stacks[this.curr_stack].Pop();
                    this.stacks[this.curr_stack].Push(y / x);
                    break;
                }
                case "%": {
                    const x = this.stacks[this.curr_stack].Pop();
                    const y = this.stacks[this.curr_stack].Pop();
                    this.stacks[this.curr_stack].Push(y % x);
                    break;
                }
                case "(": {
                    const x = this.stacks[this.curr_stack].Pop();
                    const y = this.stacks[this.curr_stack].Pop();
                    this.stacks[this.curr_stack].Push(y < x ? 1 : 0);
                    break;
                }
                case ")": {
                    const x = this.stacks[this.curr_stack].Pop();
                    const y = this.stacks[this.curr_stack].Pop();
                    this.stacks[this.curr_stack].Push(y > x ? 1 : 0);
                    break;
                }
                case "=": {
                    const x = this.stacks[this.curr_stack].Pop();
                    const y = this.stacks[this.curr_stack].Pop();
                    this.stacks[this.curr_stack].push(y == x ? 1 : 0);
                    break;
                }
                //String mode
                case "\"":
                case "'":
                    this.stringMode = !!this.stringMode ? 0 : dec(instruction);
                    break;
                // Dive, Rise and Fisherman
                case "u":
                    this.hasDove = true;
                    break;
                case "O":
                    this.hasDove = false;
                    break;
                case "`":
                    this.Fisherman();
                    break;
                // Movement
                case "^":
                    this.MoveUp();
                    break;
                case ">":
                    this.MoveRight();
                    break;
                case "v":
                    this.MoveDown();
                    break;
                case "<":
                    this.MoveLeft();
                    break;
                // Mirrors
                case "/":
                    this.ReflectForward();
                    break;
                case "\\":
                    this.ReflectBack();
                    break;
                case "_":
                    this.VerticalMirror();
                    break;
                case "|":
                    this.HorizontalMirror();
                    break;
                case "#":
                    this.OmniMirror();
                    break;
                // Trampolines
                case "!":
                    this.Move();
                    break;
                case "?":
                    if(this.stacks[this.curr_stack].Pop() === 0){ this.Move(); }
                    break;
                // Stack manipulation
                case "&": {
                    if (this.stacks[this.curr_stack].register == null) {
                        this.stacks[this.curr_stack].register = this.stacks[this.curr_stack].Pop();
                    }
                    else {
                        this.stacks[this.curr_stack].Push(this.stacks[this.curr_stack].register);
                        this.stacks[this.curr_stack].register = null;
                    }
                    break;
                }
                case ":":
                    this.stacks[this.curr_stack].Duplicate();
                    break;
                case "~":
                    this.stacks[this.curr_stack].Remove();
                    break;
                case "$":
                    this.stacks[this.curr_stack].SwapTwo();
                    break;
                case "@":
                    this.stacks[this.curr_stack].SwapThree();
                    break;
                case "{":
                    this.stacks[this.curr_stack].ShiftLeft();
                    break;
                case "}":
                    this.stacks[this.curr_stack].ShiftRight();
                    break;
                case "r":
                    this.stacks[this.curr_stack].Reverse();
                    break;
                case "l":
                    this.stacks[this.curr_stack].PushLength();
                    break;
                case "[": {
                    this.SpliceStack(this.stacks[this.curr_stack].Pop());
                    break;
                }
                case "]":
                    this.CollapseStack();
                    break;
                case "I": {
                    this.curr_stack++;
                    if (this.curr_stack >= this.stacks.length) {
                        throw new RangeError("curr_stack value out of bounds");
                    }
                    break;
                }
                case "D": {
                    this.curr_stack--;
                    if (this.curr_stack < 0) {
                        throw new RangeError("curr_stack value out of bounds");
                    }
                    break;
                }
                // Output
                case "n": 
                    output = this.stacks[this.curr_stack].Pop();
                    break;
                case "o":
                    output = String.fromCharCode(this.stacks[this.curr_stack].Pop());
                    break;
                // Time
                case "S":
                    setTimeout(this.Run.bind(this), this.stacks[this.curr_stack].Pop() * 100);
                    this.Move();
                    output = true;
                    break;
                case "h":
                    this.stacks[this.curr_stack].Push(this.datetime.getUTCHours());
                    break;
                case "m":
                    this.stacks[this.curr_stack].Push(this.datetime.getUTCMinutes());
                    break;
                case "s":
                    this.stacks[this.curr_stack].Push(this.datetime.getUTCSeconds());
                    break;
                // Code box manipulation
                case "g":
                    this.PushFromCodeBox();
                    break;
                case "p":
                    this.PlaceIntoCodeBox();
                    break;
                // Functions
                case ".": {
                    this.pointer.Y = this.stacks[this.curr_stack].Pop();
                    this.pointer.X = this.stacks[this.curr_stack].Pop();
                    break;
                }
                case "C": {
                    const currCoords = new Stack([this.pointer.X, this.pointer.Y]);
                    this.stacks.splice(this.curr_stack, 0, currCoords);
                    this.curr_stack++;
                    this.pointer.Y = this.stacks[this.curr_stack].Pop();
                    this.pointer.X = this.stacks[this.curr_stack].Pop();
                    break;
                }
                case "R": {
                    const newCoords = this.stacks.splice(this.curr_stack - 1, 1).pop();
                    this.curr_stack--;
                    this.pointer.Y = newCoords.Pop()
                    this.pointer.X = newCoords.Pop();
                    break;
                }
                // End execution
                case ";":
                    output = true;
                    break;
                default:
                    throw new Error(`Unknown instruction: ${instruction}`);
            }
        }
        catch(e) {
            console.error(`Something smells fishy!\n${e != "" ? `${e}\n` : ""}Instruction: ${instruction}\nStack: ${JSON.stringify(this.stacks[this.curr_stack].stack)}`);
            return true;
        }

        return output;
    }

    Swim() {
        if(this.debug.print.codeBox) { this.PrintCodeBox(); }
        if(this.debug.print.stacks) { this.PrintStacks(); }

        const instruction = this.box[this.pointer.Y][this.pointer.X];
        this.datetime = new Date();

        if(this.stringMode != 0 && dec(instruction) != this.stringMode) {
            this.stacks[this.curr_stack].Push(dec(instruction));
        }
        else {
            const exeResult = this.Execute(instruction);
            if(exeResult === true) {
                return true;
            }
            else if(exeResult != null) {
                this.Output(exeResult);
            }
        }

        this.Move();
    }

    Move() {
        let newX = this.pointer.X + this.curr_direction[0];
        let newY = this.pointer.Y + this.curr_direction[1];

        // Keep the X coord in the boxes bounds
        if(newX < 0) {
            newX = this.maxBoxWidth;
        }
        else if(newX > this.maxBoxWidth) {
            newX = 0;
        }
        // Keep the Y coord in the boxes bounds
        if(newY < 0) {
            newY = this.maxBoxHeight;
        }
        else if(newY > this.maxBoxHeight) {
            newY = 0;
        }

        this.SetPointer(newX, newY);
    }

    /**
     * Implement C and .
     */
    SetPointer(x, y) {
        this.pointer = {X: x, Y: y};
    }

    /**
     * Implement ^
     * 
     * Changes the swim direction upward
     */
    MoveUp() {
        this.curr_direction = this.directions.NORTH;
    }
    /**
     * Implement >
     * 
     * Changes the swim direction rightward
     */
    MoveRight() {
        this.curr_direction = this.directions.EAST;
        this.dirWasLeft = false;
    }
    /**
     * Implement v
     * 
     * Changes the swim direction downward
     */
    MoveDown() {
        this.curr_direction = this.directions.SOUTH;
    }
    /**
     * Implement <
     * 
     * Changes the swim direction leftward
     */
    MoveLeft() {
        this.curr_direction = this.directions.WEST;
        this.dirWasLeft = true;
    }

    /**
     * Implement /
     * 
     * Reflects the swim direction depending on its starting value
     */
    ReflectForward() {
        if (this.curr_direction == this.directions.NORTH) {
            this.MoveRight();
        }
        else if (this.curr_direction == this.directions.EAST) {
            this.MoveUp();
        }
        else if (this.curr_direction == this.directions.SOUTH) {
            this.MoveLeft();
        }
        else {
            this.MoveDown();
        }
    }
    /**
     * Implement \
     * 
     * Reflects the swim direction depending on its starting value
     */
    ReflectBack() {
        if (this.curr_direction == this.directions.NORTH) {
            this.MoveLeft();
        }
        else if (this.curr_direction == this.directions.EAST) {
            this.MoveDown();
        }
        else if (this.curr_direction == this.directions.SOUTH) {
            this.MoveRight();
        }
        else {
            this.MoveUp();
        }
    }

    /**
     * Implement |
     * 
     * Swaps the horizontal swim direction to its opposite
     */
    HorizontalMirror() {
        if (this.curr_direction == this.directions.EAST) {
            this.MoveLeft();
        }
        else {
            this.MoveRight();
        }
    }
    /**
     * Implement _
     * 
     * Swaps the horizontal swim direction to its opposite
     */
    VerticalMirror() {
        if (this.curr_direction == this.directions.NORTH) {
            this.MoveDown();
        }
        else {
            this.MoveUp();
        }
    }
    /**
     * Implement #
     * 
     * A combination of the vertical and the horizontal mirror
     */
    OmniMirror() {
        if (this.curr_direction[0]) {
            this.VerticalMirror();
        }
        else {
            this.HorizontalMirror();
        }
    }

    /**
     * Implement x
     * 
     * Pseudo-randomly switches the swim direction
     */
    ShuffleDirection() {
        this.curr_direction = Object.values(this.directions)[Math.floor(Math.random() * 4)];
    }

    /**
     * Implement [
     *
     * Takes X number of elements out of a stack and into a new stack
     *
     * This action creates a new stack, and places it on top of the one it was created from.
     * So, if you have three stacks, A, B, and C, and you splice a stack off of stack B,
     * the new order will be: A, B,  D, and C.
     *
     * @see {@link https://esolangs.org/wiki/Fish#Stacks ><> Documentation}
     *
     * @param {int} spliceCount The number of elements to pop into a new stack
     */
    SpliceStack(spliceCount) {
        const stackCount = this.stacks[this.curr_stack].stack.length;

        if (spliceCount > stackCount) {
            throw new RangeError(`Cannot remove ${spliceCount} elements from a stack of only ${stackCount} elements`);
        }

        const newStack = new Stack(this.stacks[this.curr_stack].stack.splice(stackCount - spliceCount, spliceCount));

        // We're at the top of the stacks stack, so we can use .push
        if (this.curr_stack == this.stacks.length - 1) {
            this.stacks.push(newStack);
        }
        else {
            this.stacks.splice(this.curr_stack + 1, 0, newStack);
        }

        this.curr_stack++;
    }
    /**
     * Implement ]
     * 
     * Collapses the current stack onto the one below it
     * If the current stack is the only one, it is replaced with a blank stack
     */
    CollapseStack() {
        // Undefined behavior collapsing the first stack down when there are other stacks available
        if (this.curr_stack == 0 && this.stacks.length != 1) {
            throw new Error();
        }

        if (this.curr_stack == 0) {
            this.stacks = [new Stack()];
        }
        else {
            const collapsed = this.stacks.splice(this.curr_stack, 1).pop();
            this.curr_stack--;
            const currStackCount = this.stacks[this.curr_stack].stack.length;

            this.stacks[this.curr_stack].stack.splice(currStackCount, 0, ...collapsed.stack);
        }
    }

    /**
     * Implement g
     * 
     * Pops `y` and `x` from the stack, and then pushes the value of the character
     * at `[x, y]` in the code box.
     * 
     * NOP's and coords that are out of bounds are converted to 0.
     * 
     * Implements the behavior as defined by the original {@link https://gist.github.com/anonymous/6392418#file-fish-py-L306 ><>}, and not {@link https://github.com/redstarcoder/go-starfish/blob/master/starfish/starfish.go#L378 go-starfish}
     */
    PushFromCodeBox() {
        const y = this.stacks[this.curr_stack].Pop();
        const x = this.stacks[this.curr_stack].Pop();

        let val = undefined;
        try {
            val = this.box[y][x] || " ";
        }
        catch (e) {
            val = " ";
        }

        const valParsed = val == " " ? 0 : dec(val);

        this.stacks[this.curr_stack].Push(valParsed);
    }
    /**
     * Implement p
     * 
     * Pops `y`, `x`, and `v` off of the stack, and then places the string
     * representation of that value at `[x, y]` in the code box.
     */
    PlaceIntoCodeBox() {
        const y = this.stacks[this.curr_stack].Pop();
        const x = this.stacks[this.curr_stack].Pop();
        const v = this.stacks[this.curr_stack].Pop();

        while(y >= this.box.length) {
            this.box.push([]);
        }
        while(x >= this.box[y].length) {
            this.box[y].push(" ");
        }

        this.EqualizeBoxWidth();

        this.box[y][x] = String.fromCharCode(v);
    }

    /**
     * Implement `
     * 
     * Changes the swim direction based on the previous direction
     * @see https://esolangs.org/wiki/Starfish#Fisherman
     */
    Fisherman() {
        // Are we moving up or down?
        if (!!this.curr_direction[1]) {
            if (this.dirWasLeft) {
                this.MoveLeft();
            }
            else {
                this.MoveRight();
            }
        }
        else {
            if (this.onTheHook) {
                this.onTheHook = false;
                this.MoveUp();
            }
            else {
                this.onTheHook = true;    
                this.MoveDown();
            }
        }
    }
}
/**
 * The stack class
 */
class Stack {
    /**
     * @param {int[]} stackValues An array of values to initialize the stack with
     */
    constructor(stackValues = []) {
        /**
         * The stack
         * @type {int[]}
         */
        this.stack = stackValues;
        /**
         * A single value saved off the stack
         * @type {int}
         */
        this.register = null;
    }

    /**
     * Wrapper function for Array.prototype.push
     * @param {*} newValue 
     */
    Push(newValue) {
        if(Array.isArray(newValue)) {
            this.stack.push(...newValue);
        }
        else {
            this.stack.push(newValue);
        }
    }
    /**
     * Wrapper function for Array.prototype.pop
     * @returns {*}
     */
    Pop() {
        const value = this.stack.pop();
        if(value == undefined){ throw new Error(); }

        return value;
    }

    /**
     * Implement }
     * 
     * Shifts the entire stack leftward by one value
     */
    ShiftLeft() {
        const temp = this.stack.shift();
        this.stack.push(temp);
    }
    /**
     * Implement {
     * 
     * Shifts the entire stack rightward by one value
     */
    ShiftRight() {
        const temp = this.stack.pop();
        this.stack.unshift(temp);
    }
    /**
     * Implement $
     * 
     * Swaps the top two values of the stack
     */
    SwapTwo() {
        if(this.stack.length < 2) { throw new Error(); }
        const popped = this.stack.splice(this.stack.length - 2, 2);
        this.stack.push(...popped.reverse());
    }
    /**
     * Implement @
     * 
     * Swaps the top three values of the stack
     */
    SwapThree() {
        if(this.stack.length < 3) { throw new Error(); }
        // Get the top three values
        const popped = this.stack.splice(this.stack.length - 3, 3);
        // Shift the elements to the right
        popped.unshift(popped.pop());
        this.stack.push(...popped);
    }

    /**
     * Implement :
     * 
     * Duplicates the element on the top of the stack
     */
    Duplicate() {
        this.stack.push(this.stack[this.stack.length-1]);
    }
    /**
     * Implements ~
     * 
     * Removes the element on the top of the stack 
     */
    Remove() {
        this.stack.pop();
    }

    /**
     * Implement r
     * 
     * Reverses the entire stack
     */
    Reverse() {
        this.stack.reverse();
    }

    /**
     * Implement l
     * 
     * Pushes the length of the stack onto the top of the stack
     */
    PushLength() {
        this.stack.push(this.stack.length);
    }
}

/**
 * Get the char code of any character
 *
 * Can actually take any length of a value, but only returns the
 * char code of the first character.
 *
 * @param {*} value Any character
 * @returns {int} The value's char code
 */
function dec(value) {
    return value.toString().charCodeAt(0);
}
