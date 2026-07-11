import { formatRupee } from "../utilities/money.js"

const STORAGE_KEY = 'receipt-items'

export let receiptItems = loadReceiptItems()
const receiptBodyElem = document.querySelector('#receipt-body')

export function saveReceiptItems() {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(receiptItems))
}

function loadReceiptItems() {
    const storedItems = sessionStorage.getItem(STORAGE_KEY)
    if (!storedItems) return []

    return JSON.parse(storedItems)
}

export function resetReceipt(){
    receiptItems = []
    saveReceiptItems()
}

export function removeFromReceipt(id) {
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

export function showReceipt() {
    let html = ''
    receiptItems.forEach((receiptItem)=>{
        html += `
        
            <tr class="receipt-row" data-id="${receiptItem.id}">
        
                        <td class="receipt-row__name">${receiptItem.name}</td>
        
                        <td class="receipt-row__qty">
                            <input type="number" class="receipt-input" data-field="qty" min="1" max="${receiptItem.totalQty}" value="${receiptItem.qty}">
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

    if (receiptBodyElem) {
        receiptBodyElem.innerHTML = html
    }

}

function createReceiptItem(medicineObj) {
    return {
        id: medicineObj.id,
        name: medicineObj.name,
        mrp: medicineObj.mrp,
        qty: 1,
        discount: 0,
        amount: medicineObj.mrp,
        totalQty: medicineObj.quantity+medicineObj.free_quantity
    }
}