import { formatRupee } from "./utilities/money.js"

const receiptBodyElem = document.querySelector('#receipt-body')

const STORAGE_KEY = 'receipt-items'
function saveReceiptItems() {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(receiptItems))
}

function loadReceiptItems() {
    const storedItems = sessionStorage.getItem(STORAGE_KEY)
    if (!storedItems) return []

    return JSON.parse(storedItems)
}
let receiptItems = loadReceiptItems()
loadReceipt()

function updateSummary() {
    let totalMedicines = 0
    let totalUnits = 0
    let totalAmount = 0
    receiptItems.forEach(items => {
        totalMedicines++
        totalUnits += items.qty
        totalAmount += items.amount
    })

    totalAmount = formatRupee(totalAmount)

    document.querySelector('#total-medicines').innerText = totalMedicines
    document.querySelector('#total-units').innerText = totalUnits
    document.querySelector('#total-amount').innerText = totalAmount
}

function removeFromReceipt(id) {
    receiptItems = receiptItems.filter(item => item.id !== id)
    saveReceiptItems()
}

export function addToReceipt(medicineObj) {
    for (const item of receiptItems) {
        if (item.id === medicineObj.id) {
            item.qty++
            item.amount = (item.mrp - (item.discount / 100) * item.mrp) * item.qty
            saveReceiptItems()
            return
        }
    }

    receiptItems.push(createReceiptItem(medicineObj))
    saveReceiptItems()
}

export function loadReceipt() {
    let html = ''
    receiptItems.forEach((receiptItem)=>{
        html += `
        
            <tr class="receipt-row" data-id="${receiptItem.id}">
        
                        <td class="receipt-row__medicine">
                            <span class="receipt-row__name">${receiptItem.name}</span>
                        </td>
        
                        <td class="receipt-row__qty">
                            <input type="number" class="receipt-input" data-field="qty" min="1" value="${receiptItem.qty}">
                        </td>
        
                        <td class="receipt-row__unit-price">${formatRupee(receiptItem.mrp)}</td>
        
                        <td class="receipt-row__discount">
                            <div class="discount-wrap">
                                <input type="number" class="receipt-input" data-field="discount" min="0" max="100" value="${receiptItem.discount}">
                                <span class="discount-suffix">%</span>
                            </div>
                        </td>
        
                        <td class="receipt-row__amount">${formatRupee(receiptItem.amount)}</td>
        
                        <td class="receipt-row__remove">
                            <button class="remove-btn">×</button>
                        </td>
        
                    </tr>
        
        `
    })
    receiptBodyElem.innerHTML = html
    updateSummary()
}

function createReceiptItem(medicineObj) {
    return {
        id: medicineObj.id,
        name: medicineObj.name,
        mrp: medicineObj.mrp,
        qty: 1,
        discount: 0,
        amount: medicineObj.mrp
    }
}

// remove btn listener
receiptBodyElem.addEventListener('click', (e)=>{
    const removeBtn = e.target.closest('.receipt-row__remove')
    if(!removeBtn) return

    const row = removeBtn.closest('.receipt-row')
    const id = Number(row.dataset.id)

    removeFromReceipt(id)
    loadReceipt()
})

receiptBodyElem.addEventListener('change', (e) => {
    const input = e.target.closest('.receipt-input')
    if (!input) return

    const row = input.closest('.receipt-row')
    const id = Number(row.dataset.id)

    const field = input.dataset.field  
    const value = Number(input.value)

    const item = receiptItems.find(item => item.id === id)
    item[field] = value
    item['amount'] = (item['mrp'] - (item['discount'] / 100) * item['mrp']) * item['qty'] 
    saveReceiptItems()

    loadReceipt()
})
