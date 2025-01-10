/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs")
const path = require("path")

const financeAccountCategories = [
  { id: 1, name: "Kas & Bank", debit_normal_account: 1 },
  { id: 2, name: "Akun Piutang", debit_normal_account: 1 },
  { id: 3, name: "Persediaan", debit_normal_account: 1 },
  { id: 4, name: "Aktiva Lancar Lainnya", debit_normal_account: 1 },
  { id: 5, name: "Aktiva Tetap", debit_normal_account: 1 },
  { id: 6, name: "Depresiasi & Amortisasi", debit_normal_account: 1 },
  { id: 7, name: "Aktiva Lainnya", debit_normal_account: 1 },
  { id: 8, name: "Akun Hutang", debit_normal_account: 0 },
  { id: 9, name: "Kewajiban Lancar Lainnya", debit_normal_account: 0 },
  { id: 10, name: "Kewajiban Jangka Panjang", debit_normal_account: 0 },
  { id: 11, name: "Ekuitas", debit_normal_account: 0 },
  { id: 12, name: "Pendapatan", debit_normal_account: 0 },
  { id: 13, name: "Harga Pokok Penjualan", debit_normal_account: 1 },
  { id: 14, name: "Beban", debit_normal_account: 1 },
  { id: 15, name: "Pendapatan Lainnya", debit_normal_account: 0 },
  { id: 16, name: "Beban Lainnya", debit_normal_account: 1 },
  { id: 17, name: "Kartu Kredit", debit_normal_account: 0 },
]

const dataPath = path.join(__dirname, "default-sample.json")
let financeAccount = []

try {
  const rawData = fs.readFileSync(dataPath, "utf8")
  financeAccount = JSON.parse(rawData)
} catch (error) {
  console.error("Error reading or parsing default-sample.json:", error)
}

module.exports = { financeAccountCategories, financeAccount }

// module.exports = { accountCategories }
