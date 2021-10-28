$(document).ready(function() {

    var baseUrl = 'https://translate.astian.org/translate',
        dialogInput = $('#xml-dialog-input'),
        wordsArray = [],
        translatedArray = [],
        dialogOutput =  $('#xml-dialog-output'), 
        selectedLang = $('#selected-lang'),
        btnGO = $('#btn-go');
    
    regexConstants = {
        text: /text="(.*?)"/gim,
        jcrTitle: /jcr:Title="(.*?)"/gim,
        fieldLabel: /fieldLabel="(.*?)"/gim,
        fieldDescrption: /fieldDescription="(.*?)"/gim
    }
    
    $(btnGO).click(async function() {
        const regexes = Object.values(regexConstants);
        var content = "Label Text"
        var langSource = "en";
        var langTarget = "pt";

        regexes.forEach(reg => {
            extractWords(reg);
        });

        translate(content, langSource, langTarget)
            .then((data) => {
                console.log(data.translatedText);
            })
            .catch(function(err){
                console.error("There was an error: " + err);
            });        
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

    async function translate(content, langSource, langTarget) {
        const res = await fetch(baseUrl, {
            method: "POST",
            body: JSON.stringify({
                q: content,
                source: langSource,
                target: langTarget,
                format: "text"
            }),
            headers: { "Content-Type": "application/json" }
        });
        
        return res.json();
    };
})