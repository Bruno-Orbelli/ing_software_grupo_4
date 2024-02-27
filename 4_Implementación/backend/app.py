from website import create_app
from utils.config import DevConfig, Config

if __name__ == '__main__':
    app = create_app(DevConfig)
    port = DevConfig.PORT
    app.run(port=port)