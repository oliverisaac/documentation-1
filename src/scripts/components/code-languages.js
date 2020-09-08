// import Choices from 'choices.js';
import Cookies from 'js-cookie';

// const codeSelectOptions = {
//     searchEnabled: false,
//     placeholder: false,
//     shouldSort: false,
//     itemSelectText: '',
//     renderSelectedChoices: false,
//     duplicateItemsAllowed: false,
//     callbackOnCreateTemplates(template) {
//         return {
//             item: (classNames, data) =>
//                 template(`
//                 <div class="${classNames.item} ${
//                     data.highlighted
//                         ? classNames.highlightedState
//                         : classNames.itemSelectable
//                 } ${
//                     data.placeholder ? classNames.placeholder : ''
//                 }" data-item data-id="${data.id}" data-value="${data.value}" ${
//                     data.active ? 'aria-selected="true"' : ''
//                 } ${data.disabled ? 'aria-disabled="true"' : ''}>
//                    ${data.label}
//                 </div>
//               `),
//             choice: (classNames, data) =>
//                 template(`
//                 <div class="${classNames.item} ${classNames.itemChoice} ${
//                     data.disabled
//                         ? classNames.itemDisabled
//                         : classNames.itemSelectable
//                 }" data-select-text="${
//                     this.config.itemSelectText
//                 }" data-choice ${
//                     data.disabled
//                         ? 'data-choice-disabled aria-disabled="true"'
//                         : 'data-choice-selectable'
//                 } data-id="${data.id}" data-value="${data.value}" ${
//                     data.groupId > 0 ? 'role="treeitem"' : 'role="option"'
//                 }>
//                    ${data.label}
//                 </div>
//               `)
//         };
//     }
// };

// const codeSelector = document.querySelector('.js-code-lang-selector');

// check if cookie set, else use default language
// if (Cookies.get('code-lang')) {
//     // codeSelector.value = Cookies.get('code-lang');
//     toggleCodeBlocks(Cookies.get('code-lang'));
// } else {
//     toggleCodeBlocks();
// }

// let codeChoices = null;

// if (codeSelector) {
//     codeChoices = new Choices(codeSelector, codeSelectOptions);
// }

// codeSelector.addEventListener('change', codeLangSelectOnChangeHandler);

// function codeLangSelectOnChangeHandler(event) {
//     toggleCodeBlocks(event.target.value);
//     Cookies.set('code-lang', event.target.value, { path: '/' });
// }

function addCodeTabEventListeners() {
    const codeLinks = document.querySelectorAll('.js-code-example-link');
    if (codeLinks.length) {
        codeLinks.forEach((codeLink) => {
            codeLink.addEventListener('click', codeLangTabClickHandler);
        });
    }
}

function redirectCodeLang(codeLang = '') {
    let newCodeLang = codeLang;

    const queryParams = new URLSearchParams(window.location.search);

    if (queryParams.get('code-lang')) {

        newCodeLang = queryParams.get('code-lang');

        toggleCodeBlocks(newCodeLang);

    } else if (Cookies.get('code-lang')) {
        if (newCodeLang !== '') {
            Cookies.set('code-lang', newCodeLang, { path: '/' });
            toggleCodeBlocks(newCodeLang);
        } else {
            newCodeLang = Cookies.get('code-lang');
            toggleCodeBlocks(newCodeLang);
        }
    } else {

        // if cookie is not set, default to python
        newCodeLang = 'python';

        Cookies.set('code-lang', newCodeLang, { path: '/' });

        toggleCodeBlocks(newCodeLang);
    }
}

redirectCodeLang();

function codeLangTabClickHandler(event) {
    const queryParams = new URLSearchParams(window.location.search);
    const codeLang = event.target.dataset.codeLangTrigger;

    event.preventDefault();

    // codeLangTabHandler(codeLang)

    // event.target.classList.add('active');

    if (queryParams.get('code-lang')) {
        queryParams.set('code-lang', codeLang);
        window.history.replaceState(
            {},
            '',
            `${window.location.pathname}?${queryParams}`
        );
        Cookies.set('code-lang', codeLang, { path: '/' });
        toggleCodeBlocks(codeLang);
    } else {
        toggleCodeBlocks(codeLang);
        Cookies.set('code-lang', codeLang, { path: '/' });
    }
}

addCodeTabEventListeners();

// function refreshCodeLangSelector() {
//     const codeBlocks = document.querySelectorAll('[class*=js-code-block]');

//     const codeLangs = Array.from(codeBlocks).map((codeBlock) => {
//         if (codeBlock.dataset.codeLangBlock) {
//             return codeBlock.dataset.codeLangBlock;
//         }
//     }); 

//     const uniqueCodeLangs = [...new Set(codeLangs)];
//     // codeChoices.clearStore()
//     // codeChoices.setValue(uniqueCodeLangs)

//     // console.log('uniqueCodeLangs: ', uniqueCodeLangs);
// }

function toggleCodeBlocks(activeLang) {

    const codeLinks = document.querySelectorAll('.js-code-example-link');
    if (codeLinks.length) {
        codeLinks.forEach((codeLink) => {
            codeLink.classList.remove('active');

            if (codeLink.dataset.codeLangTrigger === activeLang) {
                codeLink.classList.add('active');
            }
        });
    }

    // non-api page code blocks
    const codeBlocks = document.querySelectorAll(
        ':not(.api) [class*=js-code-block]'
    );

    const apiCodeWrappers = document.querySelectorAll(
        '.api [class*=js-code-snippet-wrapper]'
    );

    if (codeBlocks.length) {
        codeBlocks.forEach((codeBlock) => {
            if (codeBlock.classList.contains(`js-code-block-${activeLang}`)) {
                codeBlock.classList.remove('d-none');
            } else {
                codeBlock.classList.add('d-none');
            }
        });
    }

    // there are multiple code wrappers on API pages for each endpoint, need to loop through each wrapper
    // if the active lang, from cookie, or selection does not have an associated code block, default to curl

    if (apiCodeWrappers.length) {
        apiCodeWrappers.forEach((apiCodeWrapper) => {
            const apiCodeBlocks = apiCodeWrapper.querySelectorAll(
                `.js-code-block-${activeLang}`
            );
            const apiCurlCodeBlocks = apiCodeWrapper.querySelectorAll(
                '.js-code-block-curl'
            );

            if (apiCodeBlocks.length) {
                // loop through code blocks and check if they contain the active lang
                apiCodeBlocks.forEach((apiCodeBlock) => {
                    apiCodeBlock.classList.remove('d-none');
                });
                if (activeLang !== 'curl') {
                    apiCurlCodeBlocks.forEach((apiCurlCodeBlock) => {
                        apiCurlCodeBlock.classList.add('d-none');
                    });
                }
            } else {

                // turn on curl code block for this Code Example wrapper
                apiCurlCodeBlocks.forEach((apiCurlCodeBlock) => {
                    apiCurlCodeBlock.classList.remove('d-none');

                    apiCodeWrapper
                        .querySelectorAll("[data-code-lang-trigger='curl']")
                        .forEach((curlTab) => {
                            curlTab.classList.add('active');
                        });
                });
            }
        });
    }
}

// refreshCodeLangSelector();

export { redirectCodeLang, addCodeTabEventListeners };
