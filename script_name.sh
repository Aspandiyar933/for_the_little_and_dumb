#!/bin/bash

# Generate the tree excluding files in .gitignore
tree -I "$(git ls-files --exclude-standard -oi --directory | tr '\n' '|' | sed 's/|$//')"
