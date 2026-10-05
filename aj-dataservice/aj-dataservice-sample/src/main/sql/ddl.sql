CREATE TABLE shop_address (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    receiver VARCHAR(255),
    stat INT,
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO shop_address (name, address, phone, receiver, stat)
VALUES
('Shop A', '123 Main St', '123-456-7890', 'John Doe', 0),
('Shop B', '456 Elm St', '234-567-8901', 'Jane Smith', 0),
('Shop C', '789 Oak St', '345-678-9012', 'Alice Johnson', 0),
('Shop D', '101 Maple St', '456-789-0123', 'Bob Brown', 1),
('Shop E', '202 Birch St', '567-890-1234', 'Charlie Davis', 1);