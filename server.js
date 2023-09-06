const express = require('express');
const path = require('path');
const fs = require('fs');
const HTMLParser = require('node-html-parser');

const app = express();
const port = 3000;

// Define the base directory containing your subject folders
const baseDirectory = path.join(__dirname, 'server');

// Set up middleware to serve static files from the base directory
app.use(express.static(baseDirectory));

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.use(express.json());

app.post('/start', async (req, res) => {
    // Get the data from the request body
    const { id, username, password } = req.body;

    // You can perform any processing you need here, e.g., save the data to a database
    // For now, let's just log the data to the console
    console.log('Received login data:');
    // console.log(`ID: ${id}`);
    // console.log(`Username: ${username}`);
    // console.log(`Password: ${password}`);
    let grades = await get_grades(id, username, password);  

    fs.writeFileSync('server/results.html', grades);
    // You can send a response back to the client
    res.sendFile(path.join(__dirname, 'server/results.html'));
    logout(id);
});


async function get_grades(id, username, password) {
    return promise = new Promise((resolve, reject) => {
        
        // Send the login request and fetch the main page
        fetch("https://www.ims.tau.ac.il/Tal/Login_Chk.aspx", {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "en-US,en;q=0.9,ja;q=0.8",
                "cache-control": "max-age=0",
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "cookie": "f5_cspm=1234;", // f5avraaaaaaaaaaaaaaaa_session_=CCJHOLCLNJOLAFNIMBBNLLFFNBFKDAGEGHCHBIPEAEAMPOOPEMJJHKDLACFGOMDJBMGDIDHLAPPMBLMOLGJAPNDCELBNJKJIBKKAKKLJFJGCHBOCHDFGPILGANGDBPGH; _dy_csc_ses=t; _dyjsession=228756320c4533ef8791e51851296263; glassix-visitor-id-v2-e208b0d5-7c8b-44c0-b746-619703608f2f=c8d37b85-172f-478a-860e-b3300411ae14; _hjSessionUser_44956=eyJpZCI6ImM3YWI0OGJhLTAzZTMtNTAxZS04MGNlLWVhMGE4ZDViYzY4YSIsImNyZWF0ZWQiOjE2NTgzMTgxMzg1NjksImV4aXN0aW5nIjpmYWxzZX0=; _dy_c_exps=; _dyid=-1905022473229838367; _dycst=dk.w.c.ws.; _dycnst=dg; _dy_geo=IL.AS.IL_TA.IL_TA_Ramat%20HaSharon; _dy_df_geo=Israel..Ramat%20HaSharon; _gcl_au=1.1.1131826305.1676466569; dy_fs_page=engineering.tau.ac.il%2Fyedion%2F2020-21%2F9_7441; _dy_lu_ses=228756320c4533ef8791e51851296263%3A1676469334676; _dy_toffset=0; _ga_54BW3BN312=GS1.1.1676469335.8.0.1676469335.60.0.0; _ga=GA1.3.607002895.1658317773; ASP.NET_SessionId=xlaq22lxub33gvta3g5gzyum; _dy_ses_load_seq=78957%3A1676549461541; _dy_soct=31921.38566.1676549461; TS01b1e502=0181aaedfd14d40b5d3d798e2a5e6bcb5904dbca98c6fc236c8a95488a41780f1fc31305613cb73e5010ac80892039165413e0252d5e42c140782704dfdc4cfe388b7e5ab1305d85ac217fc3fbfd92d2460d24414d7886f30b023bf5dfaad84c79c6dca58add2e41f834de884cb49b5620e98b11d3; ADRUM=s=1677195380403&r=https%3A%2F%2Fmoodle.tau.ac.il%2Fcourse%2Fview.php%3F-2097226271; f5avraaaaaaaaaaaaaaaa_session_=OKEOGGLNIGAPAMCFMAEALEGGLIIHCDKDCLBFLCBOEENEJMAALHGJHPGPGODFLDFKNKGDBPMJJHFMOCHNICLACCBFFJKMOEFKLPDPOJGPMHAPHPAPILLCHNKGNGEADCIC; TauTalId=" + id + "; TauTalUser=" + username + "; TS0144b23a=0181aaedfdefe19a9f46c430c0ea6be63dc054fc2309364fb1e17354621847455c4257194d73c393c4cf353ca4b2169056c6c54a6dd985fa347a3317ba16184d1db7e3e1e37c13ff672c1969790f509c9b767011c0cdf67ce775fe1db835888eab596c42a75341e6453bcd44d2bc807c9a911b6ca6162c7568d8ba3fa775156d291ae10498f516664aa994c46d6e367223000615acb8ab8bbdd7eed19821d030d92df7e4b6dafdd1ffeb53a30be5970d2801002ce3",
                "Referer": "https://www.ims.tau.ac.il/Tal/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "txtUser=" + username + "&txtId=" + id + "&txtPass=" + password + "&enter=%D7%9B%D7%A0%D7%99%D7%A1%D7%94&javas=1&src=",
            "method": "POST"
        }).then(response => response.text()).then(data => {
            
            // find the grades page button url
            let root = HTMLParser.parse(data)
            let gradebutton = root.querySelector("#li1");
            let gradeurl = ""
            try{
                gradeurl = gradebutton.getAttribute("onclick").slice(18, -2)
            } catch (error){
                console.log("Error!!!")
                resolve("Error.")
            }
            
            // go to the grades page
            console.log("going to https://www.ims.tau.ac.il/Tal/" + gradeurl)
            fetch("https://www.ims.tau.ac.il/Tal/" + gradeurl, {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "accept-language": "en-US,en;q=0.9,ja;q=0.8",
                    "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "iframe",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "same-origin",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1",
                    "cookie": "f5_cspm=1234;", // f5avraaaaaaaaaaaaaaaa_session_=FCFOHFCJCHGFMBBGDGPOLKJGMDAPHINHJLNKKLLBDADNOOKHLFGEGFJBEOBEEALOLLCDIECKBGGFCAHEFJCAKOAHEOMALAJAINDAAEGNNPHIMDJELKKKLGOFFENKPNLI; f5_cspm=1234; f5avraaaaaaaaaaaaaaaa_session_=PDBGDICFNJABGIKALOMMAMHIKJHKIAHDBCHMJGKGONHLHKGNLFDBAEMJPGIMOJAOFHKDBLPKKDJHBKKNCBFAHAIPOONHAPGCDPKCLFHKBMDGEHJJGCLHNMIGNAHMBBDG; _dy_csc_ses=t; _dyjsession=228756320c4533ef8791e51851296263; glassix-visitor-id-v2-e208b0d5-7c8b-44c0-b746-619703608f2f=c8d37b85-172f-478a-860e-b3300411ae14; _hjSessionUser_44956=eyJpZCI6ImM3YWI0OGJhLTAzZTMtNTAxZS04MGNlLWVhMGE4ZDViYzY4YSIsImNyZWF0ZWQiOjE2NTgzMTgxMzg1NjksImV4aXN0aW5nIjpmYWxzZX0=; _dy_c_exps=; _dyid=-1905022473229838367; _dycst=dk.w.c.ws.; _dycnst=dg; _dy_geo=IL.AS.IL_TA.IL_TA_Ramat%20HaSharon; _dy_df_geo=Israel..Ramat%20HaSharon; _gcl_au=1.1.1131826305.1676466569; dy_fs_page=engineering.tau.ac.il%2Fyedion%2F2020-21%2F9_7441; _dy_lu_ses=228756320c4533ef8791e51851296263%3A1676469334676; _dy_toffset=0; _ga_54BW3BN312=GS1.1.1676469335.8.0.1676469335.60.0.0; _ga=GA1.3.607002895.1658317773; ASP.NET_SessionId=xlaq22lxub33gvta3g5gzyum; _dy_ses_load_seq=78957%3A1676549461541; _dy_soct=31921.38566.1676549461; TS01b1e502=0181aaedfd14d40b5d3d798e2a5e6bcb5904dbca98c6fc236c8a95488a41780f1fc31305613cb73e5010ac80892039165413e0252d5e42c140782704dfdc4cfe388b7e5ab1305d85ac217fc3fbfd92d2460d24414d7886f30b023bf5dfaad84c79c6dca58add2e41f834de884cb49b5620e98b11d3; ADRUM=s=1677195380403&r=https%3A%2F%2Fmoodle.tau.ac.il%2Fcourse%2Fview.php%3F-2097226271; TauTalId=" + id + "; TauTalUser=" + username + "; f5avraaaaaaaaaaaaaaaa_session_=JHGKKHDJPIBODGPDHHJHHPIDFKAIPKNDLFONKBBMKCLDGGDDLPAEIOEPBKFHHOPPBHODJGCIIGGFGOFBGIPAIDCOLOHLOLAOLDCFEEBOGMBMCEIPEBNNPBNALCICBHFC; TS0144b23a=0181aaedfdcb2b47ff5571f9bacc10adab7c0e23baa4ba99cea0f65a0378ea22bfe20a3f23c297fac2fd5076e54cda62b670439df0e1ffb5da08d84b93ad5f702d14865e83ee33470405c7d8539a573579d48a6b57076a13e79a2b82e091adde1e20afc158e0eb3a0b50c0d9b4c709eb77aefdaba9aab43b038606737e415306dfe2cc576d2dbcdb33548496111a35bcf2c785eb1166fb94ae4e622313f0f6098d2455913789d52e666c55516062ad8ddd901428e2; f5avr0410449452aaaaaaaaaaaaaaaa_cspm_=EGCBKBJHHGCJMMKBGFMPPPLCNIHDBICCLHAKALFLHIBIMDHOHGKGONIHCBOLPLBLDBCCGNLFABKBMFMEJBHAODIEAKGJJMDJFFGKBOMFIJKIGOOGONCBODFEHHAHDABD",
                    "Referer": "https://www.ims.tau.ac.il/Tal/Sys/Main.aspx?id=" + id + "&src=&sys=tal&rightmj=1&dt=02032023200510",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": null,
                "method": "GET"
            }).then(response => response.text()).then(data => {

                // extract the form url and course number from the html
                // this is needed to get the actual grades page

                let root = HTMLParser.parse(data)
                let formurl = ""
                
                try{
                    formurl = root.querySelector("form").getAttribute("action");
                } catch (error){
                    reject("Error.");
                }

                // let courseNumber = root.querySelector("[name=tckey]").getAttribute("value");
                // console.log(formurl, courseNumber);



            }).then(() => {

                // get the grades page
                fetch("https://www.ims.tau.ac.il/Tal/TP/Tziunim_L.aspx?id=" + id + "&src=&sys=tal&rightmj=1&dt=02032023215612&first=yes&lang=", {
                    "headers": {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "accept-language": "en-US,en;q=0.9,ja;q=0.8",
                        "cache-control": "max-age=0",
                        "content-type": "application/x-www-form-urlencoded",
                        "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "iframe",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "same-origin",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1",
                        "cookie": "f5_cspm=1234;", // f5avraaaaaaaaaaaaaaaa_session_=PPEDMEOLEODOBGANGIFCCEJFHHHDGGDFKCKCFKCIIAOJBDOPHNDPHLFHEFIPPNEFLJCDHEFFIOENOLGPPFIAPJPHBPLANBMKGANMLAEDAMCGLBNDLALCLBKAGPFAELCC; f5_cspm=1234; f5avraaaaaaaaaaaaaaaa_session_=GDNNKLPNDPNPGKEDPOKKHFCDNOJHMINBNJOAFHKCFJFNDDKLDCCBPMGJMDHCFPDPIKCDILPAIOCEDCKJOLNAIOIDBPCNBGKCMBBEPMNDGBANGDKALJNFNELMODGHINOP; _dy_csc_ses=t; _dyjsession=228756320c4533ef8791e51851296263; glassix-visitor-id-v2-e208b0d5-7c8b-44c0-b746-619703608f2f=c8d37b85-172f-478a-860e-b3300411ae14; _hjSessionUser_44956=eyJpZCI6ImM3YWI0OGJhLTAzZTMtNTAxZS04MGNlLWVhMGE4ZDViYzY4YSIsImNyZWF0ZWQiOjE2NTgzMTgxMzg1NjksImV4aXN0aW5nIjpmYWxzZX0=; _dy_c_exps=; _dyid=-1905022473229838367; _dycst=dk.w.c.ws.; _dycnst=dg; _dy_geo=IL.AS.IL_TA.IL_TA_Ramat%20HaSharon; _dy_df_geo=Israel..Ramat%20HaSharon; _gcl_au=1.1.1131826305.1676466569; dy_fs_page=engineering.tau.ac.il%2Fyedion%2F2020-21%2F9_7441; _dy_lu_ses=228756320c4533ef8791e51851296263%3A1676469334676; _dy_toffset=0; _ga_54BW3BN312=GS1.1.1676469335.8.0.1676469335.60.0.0; _ga=GA1.3.607002895.1658317773; ASP.NET_SessionId=xlaq22lxub33gvta3g5gzyum; _dy_ses_load_seq=78957%3A1676549461541; _dy_soct=31921.38566.1676549461; TS01b1e502=0181aaedfd14d40b5d3d798e2a5e6bcb5904dbca98c6fc236c8a95488a41780f1fc31305613cb73e5010ac80892039165413e0252d5e42c140782704dfdc4cfe388b7e5ab1305d85ac217fc3fbfd92d2460d24414d7886f30b023bf5dfaad84c79c6dca58add2e41f834de884cb49b5620e98b11d3; ADRUM=s=1677195380403&r=https%3A%2F%2Fmoodle.tau.ac.il%2Fcourse%2Fview.php%3F-2097226271; TauTalId=" + id + "; TauTalUser=" + username + "; f5avraaaaaaaaaaaaaaaa_session_=JHGKKHDJPIBODGPDHHJHHPIDFKAIPKNDLFONKBBMKCLDGGDDLPAEIOEPBKFHHOPPBHODJGCIIGGFGOFBGIPAIDCOLOHLOLAOLDCFEEBOGMBMCEIPEBNNPBNALCICBHFC; TS0144b23a=0181aaedfda4f6eb525e41182a6e71af2da626bd62ec83ab098da3280721cddc3d47a37121b72dafea6c49d359d8fac3388d695b9296f7c47629fa3bdaa4799fb602c912524cd8fd48db50fd9a05cae38476edf59600e3aca93792513639ba5f3d0f8eafaf36a839665ca6736c37cdb5c337479f58a9a2162fd682459bb2bd98b8b191ea097fefbf58b22739de59b255bf915ca7d8d1cdfc3255cfa920b4b6abbcad83e05d4309dc46c03161512b6e2390bf3ad6cf; f5avr0410449452aaaaaaaaaaaaaaaa_cspm_=BAELHEAJMIDIGFDIODEEAAAGAPKANCAIBIGLMPHGIEBLDAEEOOBJLGIEAGKLFPBLEJKCNOAJBFHHLPPMDFPAFPHEAHLHIMPEFGDBDOFOOFJBGOPONCMGJIDAMHMCGNJO",
                        "Referer": "https://www.ims.tau.ac.il/Tal/TP/Tziunim_P.aspx?id=" + id + "&src=&sys=tal&rightmj=1&dt=02032023215207",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                    "body": "tckey=0101051211010000101&btnishur.x=35&btnishur.y=12&peula=3&javas=1&caller=tziunim_p&h_eng=",
                    "method": "POST"
                }).then(() => {


                    // set the page to show the full year's grades
                    fetch("https://www.ims.tau.ac.il/Tal/TP/Tziunim_L.aspx?id=" + id + "&src=&sys=tal&rightmj=1&dt=02032023215612&first=yes&lang=", {
                        "headers": {
                            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                            "accept-language": "en-US,en;q=0.9,ja;q=0.8",
                            "cache-control": "max-age=0",
                            "content-type": "application/x-www-form-urlencoded",
                            "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "iframe",
                            "sec-fetch-mode": "navigate",
                            "sec-fetch-site": "same-origin",
                            "sec-fetch-user": "?1",
                            "upgrade-insecure-requests": "1",
                            "cookie": "f5_cspm=1234;", // f5avraaaaaaaaaaaaaaaa_session_=MHJHKGKCPDILIJBHKCMCIGDNMADIFPFAPFDENHJHIGJKOBABJGEENDPJEPHCKOJPCKCDGKGOODKPJNAPIPBAKIIEEAKDIKLANFNHKNOKDAPBACACEBPNADGPLMGNJCIA; f5_cspm=1234; f5avraaaaaaaaaaaaaaaa_session_=GDNNKLPNDPNPGKEDPOKKHFCDNOJHMINBNJOAFHKCFJFNDDKLDCCBPMGJMDHCFPDPIKCDILPAIOCEDCKJOLNAIOIDBPCNBGKCMBBEPMNDGBANGDKALJNFNELMODGHINOP; _dy_csc_ses=t; _dyjsession=228756320c4533ef8791e51851296263; glassix-visitor-id-v2-e208b0d5-7c8b-44c0-b746-619703608f2f=c8d37b85-172f-478a-860e-b3300411ae14; _hjSessionUser_44956=eyJpZCI6ImM3YWI0OGJhLTAzZTMtNTAxZS04MGNlLWVhMGE4ZDViYzY4YSIsImNyZWF0ZWQiOjE2NTgzMTgxMzg1NjksImV4aXN0aW5nIjpmYWxzZX0=; _dy_c_exps=; _dyid=-1905022473229838367; _dycst=dk.w.c.ws.; _dycnst=dg; _dy_geo=IL.AS.IL_TA.IL_TA_Ramat%20HaSharon; _dy_df_geo=Israel..Ramat%20HaSharon; _gcl_au=1.1.1131826305.1676466569; dy_fs_page=engineering.tau.ac.il%2Fyedion%2F2020-21%2F9_7441; _dy_lu_ses=228756320c4533ef8791e51851296263%3A1676469334676; _dy_toffset=0; _ga_54BW3BN312=GS1.1.1676469335.8.0.1676469335.60.0.0; _ga=GA1.3.607002895.1658317773; ASP.NET_SessionId=xlaq22lxub33gvta3g5gzyum; _dy_ses_load_seq=78957%3A1676549461541; _dy_soct=31921.38566.1676549461; TS01b1e502=0181aaedfd14d40b5d3d798e2a5e6bcb5904dbca98c6fc236c8a95488a41780f1fc31305613cb73e5010ac80892039165413e0252d5e42c140782704dfdc4cfe388b7e5ab1305d85ac217fc3fbfd92d2460d24414d7886f30b023bf5dfaad84c79c6dca58add2e41f834de884cb49b5620e98b11d3; ADRUM=s=1677195380403&r=https%3A%2F%2Fmoodle.tau.ac.il%2Fcourse%2Fview.php%3F-2097226271; TauTalId=" + id + "; TauTalUser=" + username + "; f5avraaaaaaaaaaaaaaaa_session_=JHGKKHDJPIBODGPDHHJHHPIDFKAIPKNDLFONKBBMKCLDGGDDLPAEIOEPBKFHHOPPBHODJGCIIGGFGOFBGIPAIDCOLOHLOLAOLDCFEEBOGMBMCEIPEBNNPBNALCICBHFC; TS0144b23a=0181aaedfd1a4c1147e27b916674274059bc385d3d9a58d5516db98971c506feba9d792f5888d51ec69cef9d77ef984390969c691a5246fa11fca90a1e3661e20a6b97feccdd41da53deff75df58b08e8dc52ab5be669b57bc7c660244c98bbbaa696a2f324834cad17fec88a65e824735928939c5a9efc9640e5cde987b3b5b65a4ae160c304f981e29baf67accf6cd5d59d62cfdf46744eb62e96f5f98f272865284df3bcd5f4b45cbaf46eb71f33da02bdb85ff; f5avr0410449452aaaaaaaaaaaaaaaa_cspm_=OCGGKOPOPGNJGEHDHOAIIKCDOCLBMIMBNBOMHHLCEJFFDDKLBCCBPEGJMDBDFPDPIKCCILPAAOCAMNKNOLNAIOIDAMCLJJKEKIKFLKMDGBANGDKANJNHBKDMODGHINPB",
                            "Referer": "https://www.ims.tau.ac.il/Tal/TP/Tziunim_L.aspx?id=" + id + "&src=&sys=tal&rightmj=1&dt=02032023215612&first=yes&lang=",
                            "Referrer-Policy": "strict-origin-when-cross-origin"
                        },
                        "body": "__VIEWSTATE=%2FwEPDwUKLTczNjMwNTE1Nw8WKB4DRmFjBQQwNTAwHglUY01pc2hrYWwFBDE5LjAeDE1hdHphdlBlaWx1dAUCMDEeB2NudEJhY2sCDB4HVGNTaGFvdAUEMjEuMB4EVXNlcgUGc2Fhcm0xHgtUY1NoYW90UHRvcmUeCFRjTWVtdXphBQU4NC42Nh4FUG5pbWkFCDAxMTI1NDE5HglTaWR1cmlLZXkFBDAxMDEeC1RjTWVtdXphS290BS%2FXntee15XXpteiINee16nXlden15zXnCDXntem15jXkdeoINeR16rXm9eg15nXqh4EVG9hcgUCMTEeA1NlbWUeBE5hbWUFF9ee15XXqden15XXkdeZ16Ug16HXoteoHg1UY01pc2hrYWxQdG9yZR4EQ2h1ZwUEMDUxMh4ESWRObwUJMzI0MTgzMTc3Hg1TaWR1cmlUb2Nobml0AgEeDlRjU2lnbWFNaXNoa2FsBQQxOS4wHgpTaWR1cmlUb2FyAgEWBAILD2QWAgIBDxYCHgRUZXh0BecDPHNwYW4gY2xhc3M9bGlzdHRkPteh157XodeY16gv16nXoNeUPGJyPjwvc3Bhbj48c2VsZWN0IG5hbWU9J2xzdFNlbScgY2xhc3M9J2ZyZWVzZWxlY3RiJyB0YWJpbmRleD0xIGRpcj1ydGwgb25jaGFuZ2U9J2xpc3RzZW1fY2hhbmdlKCknPjxvcHRpb24gdmFsdWU9JzIwMjIyJz4yMDIyLzIgLSDXkScg16rXqdekIteSJm5ic3A7Jm5ic3A7Jm5ic3A7Jm5ic3A7Jm5ic3A7Jm5ic3A7KNep16DXlCLXnCAyMDIyLzIwMjMpPC9vcHRpb24%2BPG9wdGlvbiB2YWx1ZT0nMjAyMjEnPjIwMjIvMSAtINeQJyDXqtep16Qi15ImbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDso16nXoNeUItecIDIwMjIvMjAyMyk8L29wdGlvbj48b3B0aW9uIHZhbHVlPScyMDIyOSc%2BJm5ic3A7Jm5ic3A7Jm5ic3A7MjAyMiZuYnNwOy0g16nXoNeqINeq16nXpCLXkiZuYnNwOyZuYnNwOyZuYnNwOyjXqdeg15Qi15wgMjAyMi8yMDIzKSZuYnNwOzwvb3B0aW9uPjwvc2VsZWN0PmQCDw8WAh4HVmlzaWJsZWdkZLewZILvq0zMgJ2HhLkVDY2GrPnVSIlZuR3BFDcrVehF&__VIEWSTATEGENERATOR=396E2DD9&__EVENTVALIDATION=%2FwEdAAJ7XhbYTdErBZTALAH0nmoh34hq%2F3CQB6GtIyETYm65OkZTwjn%2FGSEzVKuwiKkc9yfZm9QpqdcYIU9t9E8vw2As&lstSem=20229&peula=&javas=1&old_sem=20221",
                        "method": "POST"
                    }).then(res => res.text()).then(data => resolve(data));

                });
            });

        }).catch(err => console.log(err));
    })
}

function logout(id){
    fetch("https://www.ims.tau.ac.il/Tal/Sys/Exit.aspx?id=" + id + "&src=&sys=tal&rightmj=1&dt=06092023224838&exit=1", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9,ja;q=0.8",
            "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            // "cookie": "f5_cspm=1234; f5avraaaaaaaaaaaaaaaa_session_=KGCNJFOPPHFGHOHCIOAHKGCICODGMOAIMPGCFPOLOGOGHDJHLFJOJOFEODLCHBMIHMIDNABMLHKKGCJELGLAMDDPENJLJLJHJHCOGAKEGIKOMEDHMPPFOFKNIGPPHMGL; f5_cspm=1234; f5avraaaaaaaaaaaaaaaa_session_=HBNNGKBMPGONMHAPGPGBFMBJACDGEBDCEFFDKPAMBHBELEODDDGAKLPHCJDINGGIAADDFGAFMAJGMGAHGEHABNCAANFMDFFDODMOPDKJBONPPOGGEHGGEIGIKNAJNOHD; glassix-visitor-id-v2-e208b0d5-7c8b-44c0-b746-619703608f2f=c8d37b85-172f-478a-860e-b3300411ae14; BIGipServer~WEB~ims-443-WEB=!x9IGIkKFlnaVqG3PO46x5Hh5Pg/f4znaL5Ay4grP8gocQ3A2k9o6BBtFQNecoeveibc0gnmRsJbmgZ2o2g2pF6t0sYH24GFjpS7MtCqJ; ADRUM=s=1681901681797&r=https%3A%2F%2Fmoodle.tau.ac.il%2Fmod%2Fassign%2Fview.php%3Fhash%3D2049192413; TAU-SC=!OoSskXlXLeorNFfPO46x5Hh5Pg/f43uQ8umXioAQIjQAmpuODescPFIJBSTqVBEH75z6zzViieEe4dkkWmK+rWsU+ci0psJMh82wGNqA; ASP.NET_SessionId=rwttgbdf2dbzhnbenpbkzhig; TS01b1e502=0181aaedfd4a6533c61b3adf9ebfed23dddc57bd5c8b770c0014091bade7a51a0a08291f7e584b3531867380a0b98cfe0bb380288260cfa906b9f708d9ea0ea7569f96b0dd; _ga=GA1.3.1047690758.1692358704; f5avraaaaaaaaaaaaaaaa_session_=MOGKPOGEHHDHMMMFMODLDKCAAFEIBPEOBOAPCGEKDHENJDEANMKGGKOALIEPBLAHCNADMEEEPOKCMPEFMIDAIAHIJCPCIIPNKJDGOBEFOEKAKDBNFNBDPOBJJJNFNGKC; TauTalId={IDGOESHERE}; TauTalUser=saarm1; TS0144b23a=0181aaedfdcce2cc518ebb2c659bc6149d4d73017c0666aac0e8fb435b86d23e2b327d7ca5d7352655b3dd71b2899c39dc257fd3cd09276209bc269775eb7068e91958dd7468ac0618e2e17ce8826a0ed2afff70cd88a2bcda1858df79a7bbd7a8b51fec7c422e65decd09407b0257c98c7d3e53b4caf5db4a3ce28d0f467409c3ae775b307af6dd49b73aa27dd5a9ba2c037689992cf7acbf56540c22d7fa0d0687bdfa67676347b0b31594cc69630ce45abd3072; TS8c5ee96f027=08ac4afb2fab2000e6a3db46fe3d8ba0228fcf5c4af71b68979fdfe60979361d14c96ed483b80a2d089d044e8c113000f91527cca28b2ff62c503f97914feb1667206b2ce8eb2ec42c1a88e5d30ce7bad9f58296622eaf1f89a2c576b2de224a; f5avr0509996024aaaaaaaaaaaaaaaa_cspm_=DCICGOOLCGGMCHJECEAKGMAPKOMJCIGMEKFHIHKPGCPIPNIGGNDDKFBPFGGBAKPHLBFCAFBEEHPFFIKPMANANDGGAGFIPBEGCNOCBOKLHBLGODIGNKBDKCMKCCKDMKJO",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    });
}