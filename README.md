# Encryption/Decryption Tool

This is a web-based tool for encrypting and decrypting text using various algorithms, including AES, RSA, and the Vigenère Cipher. The tool provides a user-friendly interface for experimenting with these encryption techniques.

## Features

- Encrypt and decrypt text using AES, RSA, or the Vigenère Cipher
- Copy the result to the clipboard with a single click
- Clear the result textarea to prepare for a new operation
- Sleek and responsive user interface with a dark theme

## Getting Started

To run this tool locally, follow these steps:

1. Clone the repository or download the source code files.
2. Open the `index.html` file in a web browser.
3. The tool should load and be ready for use.

Alternatively, you can visit 'https://jayarcher9.github.io/Encryption-Decryption-Tool/'.

## Usage

1. Enter the text you want to encrypt or decrypt in the "Input Text" textarea.
2. Select the desired algorithm (AES, RSA, or Vigenère Cipher) from the dropdown menu.
3. If you selected the Vigenère Cipher, enter the key in the "Key" input field.
4. Click the "Encrypt" or "Decrypt" button, depending on your desired operation.
5. The result will be displayed in the "Result" textarea.
6. You can copy the result to your clipboard by clicking the Copy icon.
7. To clear the result textarea, click the delete icon.

## Algorithm Explanations

### AES (Advanced Encryption Standard)

AES is a symmetric-key encryption algorithm that uses a single key for both encryption and decryption. It works by dividing the input plaintext into fixed-size blocks and applying a series of substitutions and permutations to each block based on the key. The algorithm uses a fixed key size (128, 192, or 256 bits) and operates on a fixed block size of 128 bits. In this implementation, a predefined 128-bit key and a 128-bit initialization vector (IV) are used.

### RSA (Rivest-Shamir-Adleman)

RSA is an asymmetric cryptographic algorithm that uses a pair of keys: a public key for encryption and a private key for decryption. It is based on the mathematical concept of factoring large prime numbers. The encryption process involves raising the plaintext to the power of the public key modulus, while the decryption process involves raising the ciphertext to the power of the private key modulus. In this implementation, a new RSA key pair is generated each time the page loads, and the public key is used for encryption, while the private key is used for decryption.

### Vigenère Cipher

The Vigenère Cipher is a polyalphabetic substitution cipher that uses a keyword to encrypt and decrypt messages. It works by shifting the letters of the plaintext by different amounts based on the corresponding letter in the key. The key is repeated cyclically to match the length of the plaintext. The encryption process involves adding the position of the plaintext letter and the key letter (modulo 26) to get the ciphertext letter. The decryption process is similar but involves subtracting the key letter position from the ciphertext letter position (modulo 26) to get the plaintext letter.

## Technologies Used

- HTML
- CSS
- JavaScript
- CryptoJS (for AES encryption/decryption)
- Node-Forge (for RSA encryption/decryption)

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## Acknowledgments

- The CryptoJS library (https://github.com/brix/crypto-js)
- The Node-Forge library (https://github.com/digitalbazaar/forge)
