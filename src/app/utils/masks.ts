export const maskNumbers = (number) => {
    number = number.replace(/\D/g, '');
    return number;
};

export const maskLetters = (letter) => {
    letter = letter.replace(/[^a-zA-Z ]/g, '');
    return letter;
};

export const maskCEP = (cep) => {
    cep = maskNumbers(cep);
    cep = cep.replace(/^(\d{2})(\d)/, '$1.$2'); // após dois valores colocar o ponto (.)
    cep = cep.replace(/\.(\d{3})(\d)/, '.$1-$2'); // após três valores colocar o hífen (-)
    return cep;
};

export const maskDate = (date) => {
    date = maskNumbers(date);
    date = date.replace(/(\d{2})(\d)/, '$1/$2');
    date = date.replace(/(\d{2})(\d)/, '$1/$2');
    return date;
};

export const maskCNPJ = (cnpj) => {
    cnpj = maskNumbers(cnpj);
    cnpj = cnpj.replace(/(\d{2})(\d)/, '$1.$2');
    cnpj = cnpj.replace(/(\d{3})(\d)/, '$1.$2');
    cnpj = cnpj.replace(/(\d{3})(\d)/, '$1/$2');
    cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');
    return cnpj;
};

export const maskCPF = (cpf) => {
    cpf = maskNumbers(cpf);
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1-$2');
    return cpf;
};
