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

Alternatively, you can visit https://jayarcher9.github.io/Encryption-Decryption-Tool

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

- Symmetric-key algorithm using a single key for encryption and decryption.
- Divides plaintext into fixed-size blocks and applies substitutions and permutations based on the key.
- Supports key sizes of 128, 192, or 256 bits with a fixed block size of 128 bits.

### RSA (Rivest-Shamir-Adleman)

- Asymmetric cryptographic algorithm using a public key for encryption and a private key for decryption.
- Based on the mathematical concept of factoring large prime numbers.
- Encryption involves raising plaintext to the power of the public key modulus; decryption involves raising ciphertext to the power of the private key modulus.

### Vigenère Cipher

- Polyalphabetic substitution cipher using a keyword for encryption and decryption.
- Shifts plaintext letters based on the corresponding letter in the cyclically repeated key.
- Encryption involves adding plaintext letter position and key letter position (modulo 26); decryption involves subtracting key letter position from ciphertext letter position (modulo 26).

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
