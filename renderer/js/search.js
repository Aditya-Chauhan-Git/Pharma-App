const medicineSearchElem = document.querySelector('#medicine-searchbar')
const suggestionsElem = document.querySelector('#suggestions')

function showResults(results) {

    let html = ''
    results.forEach(result => {
        html += `

        <div class="result-row">
                <div class="result-row__name">${result.name}</div>
                <div class="result-row__mrp">rs. ${result.mrp}</div>
                <div class="result-row__qty">${result.quantity+result.free_quantity}</div>
            </div>

        `
    })
    suggestionsElem.innerHTML = html
}

medicineSearchElem.addEventListener('input', async (e) => {
    const value = e.target.value
    const results = await window.api.searchMedicine(value)

    showResults(results)
})

medicineSearchElem.addEventListener('blur', ()=>{
    suggestionsElem.style.display = 'none'
})
medicineSearchElem.addEventListener('focus', ()=>{
    suggestionsElem.style.display = 'block'
})