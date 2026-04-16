/**
 * Wrapper pour les handlers async - capture les erreurs et les passe au middleware d'erreur.
 */
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
