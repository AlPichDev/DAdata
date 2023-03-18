let root = document.querySelector('#root');
let form = document.createElement('form');
let inputLabel = document.createElement('label');
let input = document.createElement('input');
let type = document.createElement('p');
let list = document.createElement('ul');
let shortNameLabel = document.createElement('label');
let fullNameLabel = document.createElement('label');
let innKppLabel = document.createElement('label');
let fullAddressLabel = document.createElement('label');
let shortName = document.createElement('input');
let fullName = document.createElement('input');
let innKpp = document.createElement('input');
let fullAddress = document.createElement('input');

list.classList.add('list')
input.classList.add('label');
shortName.classList.add('label');
shortName.setAttribute("readonly", true);
fullName.classList.add('label');
fullName.setAttribute("readonly", true);
innKpp.classList.add('label');
innKpp.setAttribute("readonly", true);
fullAddress.classList.add('label');
fullAddress.setAttribute("readonly", true);
inputLabel.innerHTML = 'Компания или ИП';
shortNameLabel.innerHTML = 'Краткое наименование';
fullNameLabel.innerHTML = 'Полное наименование';
innKppLabel.innerHTML = 'ИНН / КПП';
fullAddressLabel.innerHTML = 'Адрес';

input.addEventListener('input', () => {
    list.replaceChildren();
    let url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
    let token = `29c334e25b72173de6404f3432bbdba393756b5b`;
    let query = `${input.value}`;

    let options = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + token
        },
        body: JSON.stringify({ query: query })
    }

    query = `${input.value}`
    fetch(url, options)
        .then(response => response.json())
        // response.text()
        .then(result => {
            const arr = result.suggestions
            arr.map(obj => {
                const data = obj.data;
                const name = obj.value;
                const fullNameWithOpf = data.name.full_with_opf;
                const address = data.address.unrestricted_value;
                const inn = data.inn;
                const kpp = data.kpp;
                const stringInSearch = document.createElement('li');

                stringInSearch.innerHTML = `${name}, ${address}, ${inn}, ${kpp}`;

                stringInSearch.addEventListener('click', () => {
                    input.value = name
                    shortName.value = name;
                    fullName.value = fullNameWithOpf;
                    innKpp.value = `${inn} / ${kpp}`;
                    fullAddress.value = address;
                    type.innerHTML = `Организация (${data.type})`
                    list.replaceChildren();
                }
)

                list.append(stringInSearch)
            })
        })
        .catch(error => console.log("error", error))
})

inputLabel.append(input);
inputLabel.append(list);
inputLabel.append(type);
shortNameLabel.append(shortName);
fullNameLabel.append(fullName);
innKppLabel.append(innKpp);
fullAddressLabel.append(fullAddress);
form.append(inputLabel);
form.append(shortNameLabel);
form.append(fullNameLabel);
form.append(innKppLabel);
form.append(fullAddressLabel);
root.append(form);




//`<div>${name}, ${address}, ${inn}, ${kpp}</div>`



