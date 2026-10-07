// Copies Suman_Jha_Resume.pdf from the project root into public/ so the website always serves your latest resume.
import { copyFileSync, existsSync } from 'node:fs'

if (existsSync('Suman_Jha_Resume.pdf')) {
  copyFileSync('Suman_Jha_Resume.pdf', 'public/Suman_Jha_Resume.pdf')
  console.log('Resume synced: Suman_Jha_Resume.pdf -> public/')
}
