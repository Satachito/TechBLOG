# Building a Minimal WebAssembly Environment with Clang and LLD

When you want to generate **bare-metal WebAssembly** directly from C++ (without relying on Emscripten), the toolchain boils down to just two things:

* `clang` — to compile C++ into `wasm32` object files
* `wasm-ld` — to link those objects into a `.wasm` module

This post walks through a minimal setup with Docker so you can build and run a tiny sample.

---

## Sample Project

Let’s start with a trivial function that triples an integer, exports it to WebAssembly, and logs the argument from JavaScript.

### `_.hpp`

```cpp
inline auto
tripleInt(int _) {
    return _ * 3;
}
```

### `_.cpp`

```cpp
#include "_.hpp"

extern "C" {
    int TripleInt(int _) {

        extern void JS_LOG(int);
        JS_LOG(_);

        return tripleInt(_);
    }
}
```

### `index.html`

```html
<script type="module">

const { instance } = await WebAssembly.instantiateStreaming(
    fetch("_.wasm"),
    { env: {
        JS_LOG: x => console.log("WASM:", x)
    }}
);

console.log(
    instance.exports.TripleInt(8) + " <- TripleInt(8)"
);

</script>
```

---

## Build Script

### `_.sh`

```sh
clang -v _.cpp \
    --std=c++23 \
    --target=wasm32 \
    -nostdlib \
    -c -o _.o

wasm-ld _.o \
    --no-entry \
    --export-all \
    --allow-undefined \
    -o _.wasm

rm _.o
```

That’s it! Compile to an object file, link into `.wasm`, and you’re ready.

---

## Installing the Toolchain

### On Ubuntu

```sh
apt install clang
apt install lld
```

### On macOS

⚠️ Note: the default `clang` shipped with **Xcode** does **not** support `--target=wasm32`.
You’ll need to install LLVM via Homebrew and explicitly use that `clang`:

```sh
brew install llvm
/opt/homebrew/opt/llvm/bin/clang --version
```

However, `wasm-ld` is not included in the Homebrew package. To get it, you’ll have to build LLVM from source:

```sh
brew install git cmake ninja
git clone https://github.com/llvm/llvm-project.git
cd llvm-project
mkdir build && cd build
cmake -G Ninja ../llvm \
  -DLLVM_ENABLE_PROJECTS="clang;lld" \
  -DCMAKE_BUILD_TYPE=Release \
  -DLLVM_TARGETS_TO_BUILD="WebAssembly"
ninja
```

If that feels like too much hassle (and honestly, it is), Docker is the way to go.

---

## Docker Setup (Recommended)

Here’s a simple Dockerfile that gives you a clean build environment in seconds.

### `Dockerfile`

```dockerfile
FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update \
 && apt install -y clang lld \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /mnt
CMD ["sh", "_.sh"]
```

### Build the Docker image

```sh
docker build -t clang-wasm-ld .
```

### Run the build

```sh
docker run -it --rm -v .:/mnt clang-wasm-ld
```

This will generate `_.wasm` in your working directory.

---

## Running It

Just serve index.html and open it in your browser — you’ll see the following output in the console:

```
WASM: 8
24 <- TripleInt(8)
```

Congratulations — you’ve just built and executed a minimal WebAssembly module with `clang` + `wasm-ld`! 🚀

