// Test script to verify standalone app setup
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Testing Standalone App Setup...\n');

// Check if all required files exist
const requiredFiles = [
  'package.json',
  'src/App.tsx',
  'src/hooks/useSupabase.ts',
  '.env.example'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Check if package.json has correct name
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
if (packageJson.name === 'gulf-unified-platform-standalone') {
  console.log('✅ Package name is correct');
} else {
  console.log('❌ Package name is incorrect');
  allFilesExist = false;
}

// Check if useSupabase.ts has enhanced concurrency features
const useSupabaseContent = fs.readFileSync(path.join(__dirname, 'src/hooks/useSupabase.ts'), 'utf8');
if (useSupabaseContent.includes('retries') && useSupabaseContent.includes('Date.now()')) {
  console.log('✅ useSupabase.ts has enhanced concurrency features');
} else {
  console.log('❌ useSupabase.ts missing concurrency enhancements');
  allFilesExist = false;
}

console.log('\n' + '='.repeat(50));

if (allFilesExist) {
  console.log('🎉 Enhanced app setup is complete!');
  console.log('\nNext steps:');
  console.log('1. Update .env with your Supabase credentials');
  console.log('2. Start the app with: npm run dev');
  console.log('3. Test multiple link generation simultaneously');
} else {
  console.log('❌ Some issues found. Please check the errors above.');
}