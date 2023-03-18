class DadataSuggestions extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        <style>
        li {
            text-decoration: none;
            list-style: none;
            background-color: #fff;
        }
        
        label {
            position: relative;
            display: block;
        }
        
        .label {
            display: block;
            width: 50%;
        }
        
        .list {
            padding: 0;
            margin: 0;
            position: absolute;
            left: 0;
            top: 40px;
            z-index: 2;
            width: 300px;
        }
        
        .list li {
            cursor: pointer;
            border: 1px solid black;
            border-top: 0;
        }
        
        .list li:hover {
            background-color: lightblue;
            color: aliceblue;
        
        }
        </style>
        <form>
          <label for="company">
            Компания или ИП
            <input class="label" type="text" id="company">
            <ul class="list"></ul>
            <p></p>
          </label>
          
          <label for="short-name">
            Краткое наименование
            <input class="label" type="text" id="short-name" readonly>
          </label>
          
          <label for="full-name">
            Полное наименование
            <input class="label" type="text" id="full-name" readonly>
          </label>
          
          <label for="inn-kpp">
            ИНН / КПП
            <input class="label" type="text" id="inn-kpp" readonly>
          </label>
          
          <label for="address">
            Адрес
            <input class="label" type="text" id="address" readonly>
          </label>
        </form>
      `;
    }
  
    connectedCallback() {
      const input = this.shadowRoot.querySelector("#company");
      const list = this.shadowRoot.querySelector(".list");
      const shortName = this.shadowRoot.querySelector("#short-name");
      const fullName = this.shadowRoot.querySelector("#full-name");
      const innKpp = this.shadowRoot.querySelector("#inn-kpp");
      const fullAddress = this.shadowRoot.querySelector("#address");
      const type = this.shadowRoot.querySelector("p");
  
      input.addEventListener("input", () => {
        list.replaceChildren();
        const url =
          "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
        const token = "29c334e25b72173de6404f3432bbdba393756b5b";
        const query = input.value;
  
        const options = {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Token " + token,
          },
          body: JSON.stringify({ query: query }),
        };
  
        fetch(url, options)
          .then((response) => response.json())
          .then((result) => {
            const arr = result.suggestions;
            arr.map((obj) => {
              const data = obj.data;
              const name = obj.value;
              const fullNameWithOpf = data.name.full_with_opf;
              const address = data.address.unrestricted_value;
              const inn = data.inn;
              const kpp = data.kpp;
              const stringInSearch = document.createElement("li");
  
              stringInSearch.innerHTML = `${name}, ${address}, ${inn}, ${kpp}`;
  
              stringInSearch.addEventListener("click", () => {
                input.value = name;
                shortName.value = name;
                fullName.value = fullNameWithOpf;
                innKpp.value = `${inn} / ${kpp}`;
                fullAddress.value = address;
                type.innerHTML = `Организация (${data.type})`;
                list.replaceChildren();
              });
  
              list.append(stringInSearch);
            });
          })
          .catch((error) => console.log("error", error));
      });
    }
  }
  
  customElements.define("dadata-suggestions", DadataSuggestions);
  
  // использование:
  // <dadata-suggestions></dadata-suggestions>