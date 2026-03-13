const fs = require('fs');
const path = require('path');

const pairedJsonPath = path.join(process.env.HOME || process.env.USERPROFILE, '.openclaw', 'devices', 'paired.json');

try {
  if (!fs.existsSync(pairedJsonPath)) {
    console.error(`[Error] Could not find ${pairedJsonPath}`);
    console.error('Please make sure you have paired at least one device on this server before running this patch.');
    process.exit(1);
  }

  const data = fs.readFileSync(pairedJsonPath, 'utf8');
  const devices = JSON.parse(data);
  let changed = false;

  for (const deviceId in devices) {
    const device = devices[deviceId];
    
    // Patch device.scopes
    if (device.scopes && Array.isArray(device.scopes)) {
      if (!device.scopes.includes('operator.read')) { device.scopes.push('operator.read'); changed = true; }
      if (!device.scopes.includes('operator.write')) { device.scopes.push('operator.write'); changed = true; }
    }
    
    // Patch device.approvedScopes
    if (device.approvedScopes && Array.isArray(device.approvedScopes)) {
      if (!device.approvedScopes.includes('operator.read')) { device.approvedScopes.push('operator.read'); changed = true; }
      if (!device.approvedScopes.includes('operator.write')) { device.approvedScopes.push('operator.write'); changed = true; }
    }

    // Patch device.tokens.operator.scopes
    if (device.tokens && device.tokens.operator && device.tokens.operator.scopes && Array.isArray(device.tokens.operator.scopes)) {
      if (!device.tokens.operator.scopes.includes('operator.read')) { device.tokens.operator.scopes.push('operator.read'); changed = true; }
      if (!device.tokens.operator.scopes.includes('operator.write')) { device.tokens.operator.scopes.push('operator.write'); changed = true; }
    }
  }

  if (changed) {
    fs.writeFileSync(pairedJsonPath, JSON.stringify(devices, null, 2), 'utf8');
    console.log(`[Success] Patched ${Object.keys(devices).length} device(s) in paired.json!`);
    console.log('IMPORTANT: Please RESTART your OpenClaw gateway for the new scopes to take effect.');
  } else {
    console.log('[Info] No changes were necessary. The operator.read and operator.write scopes were already present.');
  }
} catch (error) {
  console.error('[Error] Failed to patch paired.json:', error);
}
