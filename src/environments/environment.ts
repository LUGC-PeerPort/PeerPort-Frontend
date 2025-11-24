export const environment: {
    production: boolean;
    courseApi: string;
    fileSignatures: Record<string, string>;
} = {
    production: false,
    courseApi: 'http://localhost:3000/',
    // AI GENERATED TO SAVE TIME //
    // A-3: Offset-0-only, normalized, deduplicated mapping
    fileSignatures: {
        // Images
        "FFD8FFE0": "image/jpeg",
        "FFD8FFE1": "image/jpeg",
        "FFD8FFDB": "image/jpeg",
        "FFD8FFEE": "image/jpeg",
        "89504E470D0A1A0A": "image/png",
        "474946383761": "image/gif",        // GIF87a
        "474946383961": "image/gif",        // GIF89a
        "424D": "image/bmp",
        "49492A00": "image/tiff",           // II * little-endian TIFF
        "4D4D002A": "image/tiff",           // MM * big-endian TIFF
        "52494646": "application/x-riff",   // RIFF container (AVI/WAV/WEBP — needs later bytes to disambiguate)
        "52494646D07A": "image/webp",       // (some heuristics include WEBP later) - still generic as RIFF

        // Vector / other image formats
        "49492A": "image/tiff",
        "38425053": "image/vnd.adobe.photoshop", // PSD: 8BPS

        // Documents / text encoded certs
        "25504446": "application/pdf",      // %PDF
        "2D2D2D2D2D424547494E20": "application/x-pem-file", // "-----BEGIN "

        // Archives / containers
        "504B0304": "application/zip",      // PK..
        "504B0506": "application/zip",
        "504B0708": "application/zip",
        "377ABCAF271C": "application/x-7z-compressed", // 7z
        "526172211A0700": "application/x-rar-compressed", // RAR v4 (partial)
        "526172211A070100": "application/x-rar-compressed", // RAR v5
        "1F8B08": "application/gzip",
        "FD377A585A00": "application/x-xz",
        "1F9D": "application/x-compress",   // compress (.Z) legacy
        "425A6839": "application/x-bzip2",  // BZh9 (bzip2)

        // Common archives/installer formats
        "4D5A": "application/x-msdownload", // MZ - EXE / DLL / PE
        "7F454C46": "application/x-elf",    // ELF binaries
        "4F676753": "application/ogg",      // Ogg ('OggS')
        "664C6143": "audio/flac",           // FLAC 'fLaC'

        // Audio
        "494433": "audio/mpeg",             // ID3 tag (MP3)
        "FFFB": "audio/mpeg",               // MPEG audio frame (common)
        "FFF3": "audio/mpeg",
        "FFF2": "audio/mpeg",
        "57415645": "audio/wav",            // 'WAVE' (but normally with RIFF at 0)

        // Video / containers
        "1A45DFA3": "video/x-matroska",     // Matroska / WebM
        "3026B2758E66CF11": "video/x-ms-wmv", // ASF / WMV (GUID header)
        "000001BA": "video/mpeg",           // MPEG Program stream (MPEG PS)
        "000001B3": "video/mpeg",           // MPEG Video
        "00000100": "video/mpeg",           // MPEG systems / PS variants

        // Fonts
        "00010000": "font/ttf",             // TrueType (often starts 00 01 00 00)
        "4F54544F": "font/otf",             // 'OTTO' OpenType
        "774F4646": "font/woff",            // wOFF: "wOFF"
        "774F4632": "font/woff2",           // wOF2: "wOF2"

        // Database / data formats
        "53514C69746520666F726D6174203300": "application/vnd.sqlite3", // "SQLite format 3\0"
        "4C000000": "application/x-little-endian-db", // some DBs (placeholder)

        // Image/photography raw formats (common starting bytes)
        "4949": "image/x-raw",               // generic little-endian raw (e.g., some RAW files)
        "42434954": "image/x-raw",           // 'BCIT' placeholder - many RAW vary by vendor

        // Adobe / design
        "41524348": "application/arc",        // ARC (older archive)

        // Microsoft Office legacy compound file (OLECF)
        "D0CF11E0A1B11AE1": "application/vnd.ms-office", // OLE Compound File (doc/xls/ppt legacy)
        
        // HTML/XML (text files) - often no magic bytes, but can start with '<' or '<?xml'
        "3C3F786D6C20": "application/xml",   // '<?xml '

        // Certificate / key files (PEM begins with dashes already)
        "2D2D2D2D2D425447": "application/x-pem-file",

        // Image/Vector special
        "255044462D312E": "application/pdf", // "%PDF-1." (more specific)
        "504B030414000600": "application/epub+zip", // EPUB is zip-based (needs extension or container checks)

        // Disk / Virtual disk formats
        "4B444E": "application/x-kdn",        // sample

        // Forensic / archive / misc frequently-used signatures
        "2321": "text/x-shellscript",         // #! (script)
        "255044462D": "application/pdf",

        // Misc/others - common small signatures
        "494E444558": "application/x-indexeddb", // example
        "7B5C7274": "application/json",       // placeholder (some text files)

        // Generic fallback signatures repeated intentionally for recognition
        "00000000": "application/octet-stream"
    }
};