
import { db } from "@/main"


const patternEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const patternCnpj = /^[0-9]{2}[.][0-9]{3}[.][0-9]{3}[/]0001[-][0-9]{2}$/;

Array.prototype.unique = function (compare) {
    var a = this.concat()
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (!compare && a[i] === a[j] || compare && compare(a[i], a[j]))
                a.splice(j--, 1)
        }
    }
    return a;
}

Array.prototype.duplicated = function (compare) {
    var a = this.concat(); var b = [];
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (!compare && a[i] === a[j] || compare && compare(a[i], a[j]))
                b.push(a[i]);
        }
    }
    return b;
}

function validateClient(client) {
    let validateObj = { isValid: true, errors: [] };
    if (!client.name) {
        validateObj.isValid = false;
        validateObj.errors.push('O preenchimento do nome é obrigatório para todos os clientes.');
    }
    if (!client.email) {
        validateObj.isValid = false;
        validateObj.errors.push('O preenchimento do e-mail é obrigatório para todos os clientes.');
    } else if (!patternEmail.test(client.email)) {
        validateObj.isValid = false;
        validateObj.errors.push(`O e-mail "${client.email}" é inválido.`);
    }
    if (!client.cnpj) {
        validateObj.isValid = false;
        validateObj.errors.push('O preenchimento do CNPJ é obrigatório para todos os clientes.');
    } else if (!patternCnpj.test(client.cnpj)) {
        validateObj.isValid = false;
        validateObj.errors.push(`O cnpj "${client.cnpj}" é inválido.`);
    }
    return validateObj;
}

function checkIfClientAreadyExists(cnpjs) {
    return new Promise(function (resolve, reject) {
        db.collection("clients")
            .where("cnpj", "in", cnpjs)
            .get()
            .then((snapshots) => {
                if (snapshots.size > 0) {
                    let existingCnpj = [];
                    snapshots.forEach(m => existingCnpj.push(m.data().cnpj));
                    reject([`Os seguintes CNPJ já estão cadastrados no banco: ${existingCnpj.join(', ')}`]);
                }
                else
                    resolve();
            })
            .catch((error) => {
                console.error("Error writing document: ", error)
            });
    });
}

function saveNewClients(clients) {
    let promises = [];
    clients.forEach(m => {
        promises.push(db.collection("clients")
            .add(m));
    });
    return Promise.all(promises);
}

function validateDuplications(clients) {
    let validateObj = { isValid: true, errors: [] };
    let duplicatedCnpjs = clients.map(m => m.cnpj).duplicated().unique();
    if (duplicatedCnpjs.length) {
        validateObj.isValid = false;
        validateObj.errors.push(`Os seguintes CNPJs estão repetidos: ${duplicatedCnpjs.join(', ')}.`);
    }
    let duplicatedEmails = clients.map(m => m.email).duplicated().unique();
    if (duplicatedEmails.length) {
        validateObj.isValid = false;
        validateObj.errors.push(`Os seguintes e-mails estão repetidos: ${duplicatedEmails.join(', ')}.`);
    }
    let duplicatedNames = clients.map(m => m.name).duplicated().unique();
    if (duplicatedNames.length) {
        validateObj.isValid = false;
        validateObj.errors.push(`Os seguintes nomes estão repetidos: ${duplicatedNames.join(', ')}.`);
    }
    return validateObj;
}

function saveClientsBatch(clients) {
    return new Promise(function (resolve, reject) {
        let errors = [];
        clients.forEach(m => {
            let validateObj = validateClient(m);
            if (!validateObj.isValid) errors = errors.concat(validateObj.errors);
            return validateObj.isValid;
        });
        errors = errors.unique();
        let validateObj = validateDuplications(clients);
        if (!validateObj.isValid) errors = errors.concat(validateObj.errors);


        if (errors.length) {
            reject(errors);
            return;
        }

        let cnpjs = clients.map(m => m.cnpj);
        checkIfClientAreadyExists(cnpjs)
            .then(function () { return saveNewClients(clients); }, reject)
            .then(resolve)
            .catch((error) => {
                console.error("Error writing document: ", error)
            });
    });
}

export default saveClientsBatch