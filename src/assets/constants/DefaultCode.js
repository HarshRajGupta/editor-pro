export const DefaultCode = [
    {
        id: 42,
        value: "markdown",
        code: "**Hello world!!!**"
    },
    {
        id: 63,
        value: "javascript",
        code: 'function fun() {\n\tconsole.log("Hello World!");\n\treturn;\n}\n\nfun();'
    }, {
        id: 45,
        value: "assembly",
        code: 'section .text\n\tglobal _start\n\n_start:\n\tmov edx, len\n\tmov ecx, msg\n\tmov ebx, 1\n\tmov eax, 4\n\tsyscall\n\tmov eax, 1\n\tsyscall\n\nsection .data\n\tmsg db "Hello, world!", 0xa\n\tlen equ $ - msg'
    }, {
        id: 46,
        value: "bash",
        code: 'echo "Hello World!"'
    }, {
        id: 47,
        value: "basic",
        code: 'PRINT "Hello World!"'
    }, {
        id: 75,
        value: "c",
        code: '#include <stdio.h>\n\nint main(void) {\n\tprintf("Hello World!\\n");\n\treturn 0;\n}'
    }, {
        id: 76,
        value: "cpp",
        code: '#include <iostream>\n\nint main() {\n\tstd::cout << "Hello World!" << std::endl;\n\treturn 0;\n}'
    }, {
        id: 48,
        value: "c",
        code: '#include <stdio.h>\n\nint main(void) {\n\tprintf("Hello World!\\n");\n\treturn 0;\n}'
    }, {
        id: 52,
        value: "cpp",
        code: '#include <iostream>\n\nint main() {\n\tstd::cout << "Hello World!" << std::endl;\n\treturn 0;\n}'
    }, {
        id: 49,
        value: "c",
        code: '#include <stdio.h>\n\nint main(void) {\n\tprintf("Hello World!\\n");\n\treturn 0;\n}'
    }, {
        id: 53,
        value: "cpp",
        code: '#include <iostream>\n\nint main() {\n\tstd::cout << "Hello World!" << std::endl;\n\treturn 0;\n}'
    }, {
        id: 50,
        value: "c",
        code: '#include <stdio.h>\n\nint main(void) {\n\tprintf("Hello World!\\n");\n\treturn 0;\n}'
    }, {
        id: 54,
        value: "cpp",
        code: '#include <iostream>\n\nint main() {\n\tstd::cout << "Hello World!" << std::endl;\n\treturn 0;\n}'
    }, {
        id: 86,
        value: "clojure",
        code: '(println "Hello World!")'
    }, {
        id: 51,
        value: "csharp",
        code: 'using System;\n\npublic class Program\n{\n\tpublic static void Main()\n\t{\n\t\tConsole.WriteLine("Hello World!");\n\t}\n}'
    }, {
        id: 77,
        value: "cobol",
        code: 'IDENTIFICATION DIVISION.\nPROGRAM-ID. HELLO-WORLD.\nPROCEDURE DIVISION.\nDISPLAY "Hello World!".\nSTOP RUN.'
    }, {
        id: 55,
        value: "lisp",
        code: '(write-line "Hello World!")'
    }, {
        id: 56,
        value: "d",
        code: 'import std.stdio;\n\nvoid main()\n{\n\twriteln("Hello World!");\n}'
    }, {
        id: 57,
        value: "elixir",
        code: 'IO.puts "Hello World!"'
    }, {
        id: 58,
        value: "erlang",
        code: 'main(_) ->\n\tio:fwrite("Hello World!\\n").'
    }, {
        id: 59,
        value: "fortran",
        code: 'PROGRAM HELLO\n\tPRINT *, "Hello World!"\nEND PROGRAM HELLO'
    }, {
        id: 44,
        value: "exe",
        code: 'print("Hello World!")'
    }, {
        id: 87,
        value: "fsharp",
        code: 'printfn "Hello World!"'
    }, {
        id: 60,
        value: "go",
        code: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello World!")\n}'
    }, {
        id: 88,
        value: "groovy",
        code: 'println "Hello World!"'
    }, {
        id: 61,
        value: "haskell",
        code: 'main = putStrLn "Hello World!"'
    }, {
        id: 62,
        value: "java",
        code: 'class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World!");\n\t}\n}'
    }, {
        id: 78,
        value: "kotlin",
        code: 'fun main() {\n\tprintln("Hello World!")\n}'
    }, {
        id: 64,
        value: "lua",
        code: 'print("Hello World!")'
    }, {
        id: 79,
        value: "objectivec",
        code: '#import <Foundation/Foundation.h>\n\nint main(int argc, const char * argv[]) {\n\t@autoreleasepool {\n\t\tNSLog(@"Hello World!");\n\t}\n\treturn 0;\n}'
    },
    {
        id: 65,
        value: "ocaml",
        code: 'print_endline "Hello World!";;'
    }, {
        id: 66,
        value: "octave",
        code: 'printf("Hello World!\\n");'
    }, {
        id: 67,
        value: "pascal",
        code: 'program HelloWorld;\nbegin\n\tWriteLn("Hello World!");\nend.'
    }, {
        id: 85,
        value: "perl",
        code: 'print "Hello World!\\n";'
    }, {
        id: 68,
        value: "php",
        code: '<?php\n\techo "Hello World!";\n?>'
    }, {
        id: 43,
        value: "text",
        code: "<h1>Hello World!</h1>"
    }, {
        id: 69,
        value: "prolog",
        code: ':- initialization(main).\n\nmain :- write(\'Hello World!\').'
    }, {
        id: 70,
        value: "python",
        code: 'print("Hello World!")'
    }, {
        id: 71,
        value: "python",
        code: 'print("Hello World!")'
    }, {
        id: 80,
        value: "r",
        code: 'print("Hello World!")'
    }, {
        id: 72,
        value: "ruby",
        code: 'print("Hello World!")'
    }, {
        id: 73,
        value: "rust",
        code: 'fn main() {\n\tprintln!("Hello World!");\n}'
    }, {
        id: 74,
        value: "typescript",
        code: 'console.log("Hello World!");'
    }, {
        id: 81,
        value: "scala",
        code: 'object Main extends App {\n\tprintln("Hello World!")\n}'
    }, {
        id: 82,
        value: "sql",
        code: 'SELECT "Hello World!";'
    }, {
        id: 83,
        value: "swift",
        code: 'print("Hello World!")'
    }, {
        id: 84,
        value: "vbnet",
        code: 'Module HelloWorld\n\tSub Main()\n\t\tConsole.WriteLine("Hello World!")\n\tEnd Sub\nEnd Module'
    }
]