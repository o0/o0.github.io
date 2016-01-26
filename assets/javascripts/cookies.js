/**
 * @fileoverview Библиотека для удобной работы с cookie.
 */

var docCookies = {
  /**
   * Возвращает значение cookie с переданным ключом sKey.
   * @param {string} sKey
   * @return {string}
   */
  getItem: function (sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },

  /**
   * Устанавливает cookie с названием sKey и значением sValue. Остальные параметры
   * необязательны и используются для более точного задания параметров cookie:
   * срок жизни cookie, домен и путь. bSecure указывает что cookie можно передавать
   * только по безопасному соединению.
   * @param {string} sKey
   * @param {string} sValue
   * @param {number|Date|string=} vEnd Срок жизни cookie. Может передаваться
   *     как дата, строка или число.
   * @param {string=} sPath
   * @param {string=} sDomain
   * @param {boolean=} bSecure
   */
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = !isFinite(vEnd) ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + (vEnd / 1000);
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },

  /**
   * Удаляет cookie по переданному ключу. sPath и sDomain необязательные параметры.
   * @param {string} sKey
   * @param {string} sPath
   * @param {string} sDomain
   * @return {boolean} Ключ, успешно ли произошло удаление. Равен false, если cookie
   *     с таким названием нет.
   */
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },

  /**
   * Проверяет, действительно ли существует cookie с переданным названием.
   * @param {string} sKey
   * @return {boolean}
   */
  hasItem: function (sKey) {
    if (!sKey) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },

  /**
   * Возвращает все ключи, установленных cookie.
   * @return {Array.<string>}
   */
  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};
