import fs from 'fs'
let s = fs.readFileSync('src/components/InputMethod/InputMethod.ux', 'utf8')
const broken = `  onRsSelect(txt) {
  onVibrate() {`
const fixed = `  onRsSelect(txt) {
    this.onVibrate();
    this.cval = "";
    this.addAllTxt(txt);
    this.clearWaiting();
    this.resetReslutList();
    this.downFlag = "";
  },
  onVibrate() {`
if (!s.includes(broken)) { console.log('pattern not found'); process.exit(1) }
s = s.replace(broken, fixed)
fs.writeFileSync('src/components/InputMethod/InputMethod.ux', s, 'utf8')
console.log('fixed')
