# Unorthodoxdev.net

Welcome to my website source files. It is written in markdown mostly, using HUGO. I like to think of this as my digital garden, 90~ of the content on the website I guarantee will be work related content. But some of it might be personal, as I adapt and get better at writing and posting things of mine online.

I have ran some form of a website since 2022, and as of lately (2023) I have finally decided to take it seriously. While Im again, not a true tech blogger, and I doubt there will be any rants on here, your free to take a browse and enjoy my website as is.

If you have any questions or comments please let me know.

Thanks : )

--- Joshua Winters-Brown

## Build

To generate a release of the website, please use the make file 

```shell
make release

# or

make

# or

hugo -b https://unorthodoxdev.net
```

To generate a development release of the website, please use the make file. Note that this will automatically host the website for you on port 1313.

```shell
make development

# or

hugo serve -b http://localhost:1313 -D
```

## New Pages

To make a new page, please run the following commands

```shell

hugo new content/yadayada --kind {page, recipe}

```
