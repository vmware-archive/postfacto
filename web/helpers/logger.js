class Logger {

  static debug(message) {
    Logger.log(message, 'DEBUG');
  }

  static info(message) {
    Logger.log(message, 'INFO');
  }

  static warn(message) {
    Logger.log(message, 'WARN');
  }

  static log(message, logLevel) {
    const sumoLogicUrl = global.Retro.config.sumo_logic_url;
    if (sumoLogicUrl) {
      const prefix = `${new Date().toISOString()} - postfacto-web - ${logLevel}: `;
      const url = `${sumoLogicUrl}?${prefix}${message}`;
      const img = new Image();
      img.src = url;
    }
  }
}

module.exports = Logger;
