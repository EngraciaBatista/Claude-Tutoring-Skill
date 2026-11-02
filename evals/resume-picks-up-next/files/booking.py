class Ticket:
    def __init__(self):
        self.count = 1
        self.version = 0

def book_ticket(ticket):
    # TODO: check the version before saving
    ticket.count -= 1
