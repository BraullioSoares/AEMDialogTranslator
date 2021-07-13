$(document).ready(function() {

    var baseUrl = 'https://translate.astian.org/translate',
        dialogInput = $('#xml-dialog-input'),
        wordsArray = [],
        translatedArray = []
        dialogOutput =  $('#xml-dialog-output'), 
        selectedLang = $('#selected-lang'),
        btnGO = $('#btn-go');
    
    regexConstants = {
        text: /text="(.*?)"/gim,
        jcrTitle: /jcr:Title="(.*?)"/gim,
        fieldLabel: /fieldLabel="(.*?)"/gim,
        fieldDescrption: /fieldDescription="(.*?)"/gim
    }
    
    $(btnGO).click(function() {
        const regexes = Object.values(regexConstants);

        regexes.forEach(reg => {
            extractWords(reg);
        });
        var test = translate();
        console.log(test);
        
    });
    
    /**
     * 
     * @returns the pasted XML Code
     */
    function getXMLCode() {
        return dialogInput.val();
    }

    /**
     * 
     * @returns extracted words from the XML dialog code.
     */
    function extractWords(reg) {
        var regex = reg;
        var str = getXMLCode();
        var m = regex.exec(str);
        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                if (groupIndex === 1) {
                    wordsArray.push(`${match}` + '\n');
                }
            });
        }
    }

    async function translate() {
        console.log(wordsArray.toString());
        const res = await fetch(baseUrl, {
            method: "POST",
            body: JSON.stringify({
                q: "testing this out",
                source: "en",
                target: "pt"
            }),
            headers: { "Content-Type": "application/json" }
        }).then(function(data)  {
            data.json();
        });

        return res;
    }
})