import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.*;

public class jsmc2 extends JFrame {

    private DefaultListModel<String> productListModel;
    private DefaultListModel<String> soldProductListModel;
    private Connection connection;

    public jsmc2() {
        setTitle("Product Sales");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());
        setSize(500, 400);

        
        productListModel = new DefaultListModel<>();
        JList<String> productList = new JList<>(productListModel);

        
        JButton uploadButton = new JButton("Upload Products");
        JButton browseButton = new JButton("Browse Products");
        JButton purchaseButton = new JButton("Purchase Product");
        JButton viewButton = new JButton("View Sold Products");

        
        JPanel buttonPanel = new JPanel();
        buttonPanel.setLayout(new FlowLayout());
        buttonPanel.add(uploadButton);
        buttonPanel.add(browseButton);
        buttonPanel.add(purchaseButton);
        buttonPanel.add(viewButton);

        
        add(new JScrollPane(productList), BorderLayout.CENTER);
        add(buttonPanel, BorderLayout.SOUTH);

        
        uploadButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                String productName = JOptionPane.showInputDialog(jsmc2.this, "Enter product name:");
                if (productName != null && !productName.isEmpty()) {
                    productListModel.addElement(productName);
                }
            }
        });

        browseButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                JOptionPane.showMessageDialog(jsmc2.this, "Browsing products...");
            }
        });

        purchaseButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                String selectedProduct = productList.getSelectedValue();
                if (selectedProduct != null) {
                    addSoldProduct(selectedProduct);
                    insertProduct(selectedProduct);
                    JOptionPane.showMessageDialog(jsmc2.this, "Product purchased: " + selectedProduct);
                } else {
                    JOptionPane.showMessageDialog(jsmc2.this, "No product selected.");
                }
            }
        });

        viewButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                showSoldProducts();
            }
        });

       
        connectToDatabase();

        setVisible(true);
    }

    private void connectToDatabase() {
        String url = "jdbc:mysql://localhost:3306/";
        String username = "root@localhost";
        String password = "sudeep";

        try {
            connection = DriverManager.getConnection(url, username, password);
            System.out.println("Connected to the database");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void createTable() {
        String query = "CREATE TABLE sold_products (" +
                "id INT AUTO_INCREMENT PRIMARY KEY," +
                "product_name VARCHAR(100)," +
                "purchase_date DATE" +
                ")";

        try {
            Statement statement = connection.createStatement();
            statement.executeUpdate(query);
            System.out.println("Table created: sold_products");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void insertProduct(String product) {
        String query = "INSERT INTO sold_products (product_name, purchase_date) VALUES (?, NOW())";

        try {
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, product);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void addSoldProduct(String product) {
        soldProductListModel.addElement(product);
    }

    private void showSoldProducts() {
        soldProductListModel.clear();

        String query = "SELECT * FROM sold_products";

        try {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(query);

            while (resultSet.next()) {
                String productName = resultSet.getString("product_name");
                addSoldProduct(productName);
            }

            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        new jsmc2();
    }
}