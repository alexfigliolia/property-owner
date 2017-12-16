// import jsPDF from 'jspdf';

export const commafy = (x) => {
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export const round = (value, precision) => {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

export const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

export const getFirstWord = (str='') => {
    const lastInit = str.match(/\b(\w)/g)[1]; 
    const spacePosition = str.indexOf(' ');
    if (spacePosition === -1)
        return str + '' + lastInit;
    else
        return str.substr(0, spacePosition) + ' ' + lastInit;
}

export const generateColor = (idx) => {
	let color;
  if(idx == 0 || idx == 3 || idx == 6 || idx == 9 || idx == 12 || idx == 15) {
    color = "#815475";
  } else if(idx == 1 || idx == 4 || idx == 7 || idx == 10 || idx == 13 || idx == 16) {
    color = "#3A6768";
  } else if(idx == 2 || idx == 5 || idx == 8 || idx == 11 || idx == 14 || idx == 17) {
    color = "#424A82";
  }
  return color;
}

export const generateColor2 = (idx) => {
	let color, color2;
  if(idx == 0 || idx == 3 || idx == 6 || idx == 9 || idx == 12 || idx == 15) {
    color = "#815475";
    color2 = "#D88AC6";
  } else if(idx == 1 || idx == 4 || idx == 7 || idx == 10 || idx == 13 || idx == 16) {
    color = "#3A6768";
    color2 = "#70CCD1";
  } else if(idx == 2 || idx == 5 || idx == 8 || idx == 11 || idx == 14 || idx == 17) {
    color = "#424A82";
    color2 = "#2C58E3";
  }
  return [color, color2];
}

export const resize = (el) => {
  const ps = document.getElementById(el);
  const height = ps.clientHeight;
  const width = ps.clientWidth;
  if(window.innerWidth >= 800 && window.innerWidth < 1070) {
    ps.style.top = ((window.innerHeight/2) - (height/2) + 40) + "px";
    ps.style.left = (window.innerWidth/2) - (width/2) + "px";
  } else if(window.innerWidth >= 1070) {
    ps.style.top = (window.innerHeight/2) - (height/2) + "px";
    ps.style.left = ((window.innerWidth/2) - (width/2) + 100) + "px";
  } else {
    ps.style.top = ((window.innerHeight/2) - (height/2) + 25) + "px";
    ps.style.left = (window.innerWidth/2) - (width/2) + "px";
  }
}

export const validateEmail = (email) => {
  if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {  
    return (true); 
  } else { 
    return (false);
  }   
}

export const validatePassword = (pw) => {
  if(pw === "" || pw === " " || pw.length > 4) {
    return true;
  } else {
    return false;
  }
}

export const validateName = (name) => {
  if( /^[a-zA-Z-'. ]+$/.test(name) &&
      name === name.replace(/\d+/g, '') &&
      /\s/g.test(name) &&
      /^[a-z ,.'-]+$/i.test(name) )
  {
    return true;
  } else {
    return false;
  }
}

export const calcMonthCollected = (rentPayments=[], month, year) => {
  let total = 0;
  if(rentPayments.length > 0) {
    for(let i = 0; i<rentPayments.length; i++) {
      if(new Date(rentPayments[i].date).getMonth() === month &&
         new Date(rentPayments[i].date).getUTCFullYear() === year) 
      {
        total += rentPayments[i].payment;
      }
    }
  }
  return total;
}

export const calcMonthExpenses = (expenses=[], month, year) => {
  let total = 0;
  if(expenses.length > 0) {
    for(let i = 0; i<expenses.length; i++) {
      if(expenses[i].solution.completed === true &&
         new Date(expenses[i].date).getMonth() === month &&
         new Date(expenses[i].date).getUTCFullYear() === year) 
      { total += parseFloat(expenses[i].solution.spent); }
    }
  }
  return total
}

export const getTotalForEachMonth = (arr=[], key1='payment', key2=undefined, year) => {
  const init = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  arr.forEach((item, i) => {
    if( new Date(item.date).getUTCFullYear() === year ) {
      if(!key2) {
        init[new Date(item.date).getMonth()] += parseFloat(item[key1]);
      } else {
        init[new Date(item.date).getMonth()] += parseFloat(item[key1][key2]);
      }
    }
  });
  return init;
}
