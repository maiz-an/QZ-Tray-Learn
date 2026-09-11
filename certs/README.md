# certs/

Put your QZ Tray key pair here:

```
certs/
├── digital-certificate.txt   (public — safe to expose over HTTP)
└── private-key.pem           (SECRET — never commit, never share)
```

Both files are listed in the project's root `.gitignore`, so `git add .`
will never pick them up. See the main `README.md` → **"Generate your own
certificate (free)"** for how to create this pair in under a minute.
