export function getReadableDate(date) {
  let dateF = new Date(date);
  let jour = dateF.getDate();
  let mois = dateF.toLocaleString("default", { month: "long" });
  let annee = dateF.getFullYear();

  return `${jour} ${mois} ${annee}`;
}

export function getReadableTime(date) {
  let dateF = new Date(date);
  let heure = dateF.getHours();
  let minutes = dateF.getMinutes();

  return `${heure}h${minutes}`;
}
