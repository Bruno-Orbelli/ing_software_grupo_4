from website import create_app
from utils.config import DevConfig
from utils.utils import mail

if __name__ == '__main__':
    app = create_app(DevConfig)
    port = DevConfig.PORT
    app.run(port=port)
    mail.init_app(app)