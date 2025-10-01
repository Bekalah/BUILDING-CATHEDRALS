// Comprehensive Organization and Cleanup Script
// Removes dust bunny files and organizes everything into proper monorepo structure

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class ProjectOrganizer {
  constructor() {
    this.rootPath = process.cwd();
    this.keepPatterns = [
      // Core system files
      'src/**',
      'apps/**',
      'packages/**',
      'docs/**',
      'scripts/**',
      '.github/**',
      'public/**',

      // Essential config files
      'package.json',
      'vite.config.js',
      'pnpm-workspace.yaml',
      'turbo.json',
      'nx.json',
      '.env*',
      '.gitignore',
      '.nojekyll',
      'README.md',
      'README_AZURE_HANDOFF.md',
      'CATHEDRAL_DEPLOYMENT_GUIDE.md',
      'CATHEDRAL_REFERENCE.md',

      // Documentation
      'docs/SYSTEM_STANDARDS_PLAN.md',
      'docs/PROTECT.md',
      'docs/LINT_TEST_SETUP.md',

      // Essential data
      'src/data/**',
      'data/**',

      // Copyright and legal
      '**/COPYRIGHT.txt',
      '**/LICENSE*'
    ];

    this.removePatterns = [
      // Old scattered files
      'stone-grimoire/**',
      'Cathedral0fCircuits/**',
      'CIRC_BACKUP_18/**',
      'Sunday-cathedral/**',
      'data_other_folder/**',
      'dist-core/**',

      // Individual scattered files
      '*.html',
      '*.pdf',
      '*.md',
      '*.txt',
      '*.png',
      '*.jpg',
      '*.jpeg',
      '*.svg',
      '*.zip'
    ].filter(pattern => !this.keepPatterns.some(keep => pattern.includes(keep.replace('**', ''))));
  }

  async organize() {
    console.log('🧹 Starting comprehensive project organization...');

    try {
      // 1. Create clean directory structure
      await this.createCleanStructure();

      // 2. Move essential files to proper locations
      await this.moveEssentialFiles();

      // 3. Remove scattered files
      await this.removeDustBunnies();

      // 4. Update all import paths
      await this.updateImportPaths();

      // 5. Validate structure
      await this.validateStructure();

      console.log('✅ Project organization complete!');
      console.log('📁 Clean monorepo structure ready for deployment');

    } catch (error) {
      console.error('❌ Organization failed:', error.message);
      process.exit(1);
    }
  }

  async createCleanStructure() {
    console.log('📁 Creating clean monorepo structure...');

    const structure = {
      'apps/stone-grimoire/src': {},
      'apps/cathedral-of-circuits/src': {},
      'apps/arcanae-lab/src': {},
      'packages/ui/src': {},
      'packages/hooks/src': {},
      'packages/data-models/src': {},
      'packages/assets/src': {},
      'docs/guides': {},
      'scripts/automation': {}
    };

    for (const [dirPath] of Object.entries(structure)) {
      const fullPath = path.join(this.rootPath, dirPath);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`📁 Created: ${dirPath}`);
      }
    }
  }

  async moveEssentialFiles() {
    console.log('📦 Moving essential files to proper locations...');

    // Move current src files to stone-grimoire app
    const sourceFiles = [
      'src/App.jsx',
      'src/components/**',
      'src/data/**',
      'src/hooks/**',
      'src/services/**'
    ];

    for (const pattern of sourceFiles) {
      const sourcePath = path.join(this.rootPath, pattern);
      const destPath = path.join(this.rootPath, 'apps/stone-grimoire', pattern);

      if (fs.existsSync(sourcePath)) {
        // Ensure destination directory exists
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }

        // Copy files
        if (fs.statSync(sourcePath).isDirectory()) {
          this.copyDirectory(sourcePath, destPath);
        } else {
          fs.copyFileSync(sourcePath, destPath);
        }

        console.log(`📦 Moved: ${pattern} -> apps/stone-grimoire/${pattern}`);
      }
    }
  }

  async removeDustBunnies() {
    console.log('🗑️ Removing scattered dust bunny files...');

    const filesToRemove = [
      // Old scattered directories
      'stone-grimoire',
      'Cathedral0fCircuits',
      'CIRC_BACKUP_18',
      'Sunday-cathedral',
      'data_other_folder',
      'dist-core',

      // Individual scattered files in root
      'alchemy.json',
      'ambient-engine.js',
      'An Art-Science Technology for Interchangeable Archetypes and Harmonic Research.pdf',
      'angel-lab.html',
      'angels72.json',
      'book-processor-proposal.md',
      'Cathedral Final Components and Registries.pdf',
      'Cathedral Instructions Set 2',
      'Cathedral Instructions Set 3 - Contributors',
      'CATHEDRAL_ARCHIVE.savedSearch',
      'Cathedral_Code_Annex.html.svg',
      'Cathedral_Instructrions',
      'CATHEDRAL_NODE_STANDARDS.md',
      'CATHEDRAL_SCROLL_FULL.md',
      'CATHEDRAL_SCROLL_PART1.md',
      'CATHEDRAL_SCROLL_PART2.md',
      'CATHEDRAL_SCROLL_PART3.md',
      'cathedral-demo.html',
      'cathedral-engine.js',
      'cathedral-full.patch.txt',
      'cathedral-integration-hub.html',
      'chat-GitHub Pages Cloudflare Setup.txt',
      'CODEX 144:99 Canonical Seed Instructions',
      'CODEX 144:99 notes for tarot',
      'Codex 144:99 Secret Inner Book',
      'codex_144_nodes_template.json',
      'Codex14499_Recovery_Core_AtoD_Revised (1).pdf',
      'crypt.html',
      'cymatic-engine.js',
      'Double Tree of Life Structure',
      'ELITE-biometrics.html',
      'FULL CODEX 144:99 -Fusion Kink Nodes Set',
      'FUSION KINK SYSTEM OVERVIEW',
      'github-recovery-codes.txt',
      'HELPFUL REPO STRUCTURE INSTRUCTIONS',
      'lady-chapel.html',
      'LIBER ARCANE: CODEX OF ABYSSIAE DATASETS',
      'LIBER-ARCANAE-FULL-NOTES',
      'LIVING TAROT MASTER FILES',
      'musical-cubes.html',
      'NET OF INDRA SYSTEM FUNCTION LOGIC',
      'structure.json',
      'UPDATINGCATHEDRAL.code-workspace',
      'v3-cathedral-monorepo.txt',
      'VIENNA copy.html',
      'VIENNA.html'
    ];

    for (const file of filesToRemove) {
      const fullPath = path.join(this.rootPath, file);
      if (fs.existsSync(fullPath)) {
        if (fs.statSync(fullPath).isDirectory()) {
          fs.rmSync(fullPath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(fullPath);
        }
        console.log(`🗑️ Removed: ${file}`);
      }
    }
  }

  async updateImportPaths() {
    console.log('🔗 Updating import paths for monorepo structure...');

    // Update main App.jsx to use correct imports
    const appPath = 'apps/stone-grimoire/src/App.jsx';
    if (fs.existsSync(appPath)) {
      let content = fs.readFileSync(appPath, 'utf8');

      // Update import paths to use monorepo structure
      content = content.replace(
        /from '\.\//g,
        'from \'../../packages/'
      );

      content = content.replace(
        /from '\.\.\/hooks\//g,
        'from \'../../packages/hooks/'
      );

      content = content.replace(
        /from '\.\.\/components\//g,
        'from \'../../packages/ui/'
      );

      content = content.replace(
        /from '\.\.\/data\//g,
        'from \'../../packages/data-models/'
      );

      fs.writeFileSync(appPath, content);
      console.log('✅ Updated import paths in App.jsx');
    }
  }

  async validateStructure() {
    console.log('🔍 Validating clean monorepo structure...');

    const requiredStructure = [
      'apps/stone-grimoire/src/App.jsx',
      'apps/cathedral-of-circuits/package.json',
      'apps/arcanae-lab/package.json',
      'packages/ui/src',
      'packages/hooks/src',
      'packages/data-models/src',
      'docs/SYSTEM_STANDARDS_PLAN.md',
      'scripts/auto-fix.js',
      '.github/workflows'
    ];

    let allValid = true;

    for (const requirement of requiredStructure) {
      const fullPath = path.join(this.rootPath, requirement);
      if (fs.existsSync(fullPath)) {
        console.log(`✅ Valid: ${requirement}`);
      } else {
        console.log(`❌ Missing: ${requirement}`);
        allValid = false;
      }
    }

    if (allValid) {
      console.log('🎉 Structure validation passed!');
    } else {
      console.log('⚠️ Some structure elements missing');
    }

    return allValid;
  }

  copyDirectory(source, destination) {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    const files = fs.readdirSync(source);
    for (const file of files) {
      const sourcePath = path.join(source, file);
      const destPath = path.join(destination, file);

      if (fs.statSync(sourcePath).isDirectory()) {
        this.copyDirectory(sourcePath, destPath);
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    }
  }

  async run() {
    await this.organize();
  }
}

// Auto-run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const organizer = new ProjectOrganizer();
  organizer.run().catch(console.error);
}

export default ProjectOrganizer;
