const filterProfanity = (text) => {

    const profanities = ["ควย", "เหี้ย", "เย็ด", "สัส", "fuck" ,"fucker", "shit", "dick", "bitch"];  
    profanities.forEach(profane => {
      const regex = new RegExp(profane, "gi"); 
      text = text.replace(regex, "*".repeat(profane.length));  
    });  
    return text;
  };
  
export default filterProfanity;