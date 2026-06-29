import { addToReceipt, loadReceipt } from "./receipt.js"

const searchElem = document.querySelector('#search')
const medicineSearchElem = document.querySelector('#medicine-searchbar')
const suggestionsElem = document.querySelector('#suggestions')

function showResults(results) {

    let html = ''
    results.forEach(result => {
        html += `

        <div class="suggestions-row" data-id="${result.id}" tabindex="-1">
                <div class="suggestions-row__name">${result.name}</div>
                <div class="suggestions-row__mrp">₹${result.mrp}</div>
                <div class="suggestions-row__qty">${result.quantity + result.free_quantity === 0 ? "Out of Stock": result.quantity + result.free_quantity}</div>
            </div>

        `
    })
    suggestionsElem.innerHTML = html
}

medicineSearchElem.addEventListener('input', async (e) => {
    const value = e.target.value
    const results = await window.searchApi.searchByLetter(value)

    showResults(results)
})

suggestionsElem.addEventListener('click', async (e) => {
    const row = e.target.closest('.suggestions-row');
    if (!row) return; 

    const rowId = row.dataset.id;
    const medicineObj = await window.searchApi.searchById(rowId);

    addToReceipt(medicineObj);
    loadReceipt();
});


searchElem.addEventListener('focusout', (e)=>{
    if(searchElem.contains(e.relatedTarget)) return 
    suggestionsElem.style.display = 'none'
})
searchElem.addEventListener('focusin', ()=>{
    suggestionsElem.style.display = 'block'
})

// complete the reading in claude correcting receipts functionality