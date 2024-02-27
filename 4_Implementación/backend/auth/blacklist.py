class RecoveryBlacklist():
    def __init__(self) -> None:
        self.blacklist = set()

    def add(self, decryptedToken: dict) -> None:
        self.blacklist.add(decryptedToken['jti'])
    
    def is_blacklisted(self, decryptedToken: dict):
        print(decryptedToken)
        return decryptedToken['jti'] in self.blacklist
    
    def remove(self, decryptedToken: dict) -> None:
        try:
            self.blacklist.remove(decryptedToken['jti'])
        except KeyError:
            pass