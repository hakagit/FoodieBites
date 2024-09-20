import React, { useEffect, useState } from "react";
import "./Admin.css"; // Ensure your CSS file is linked for styles
import Select from "react-select"; // Import react-select

const AdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryQuantity, setNewCategoryQuantity] = useState(1);
  const [newDish, setNewDish] = useState({
    name: "",
    categoryId: "",
    quantity: 1,
    price: "",
  });
  const [newSupplier, setNewSupplier] = useState("");
  const [newInventory, setNewInventory] = useState({
    name: "",
    quantity: 1,
    expiry: "",
  });
  const [selectedSupplier, setSelectedSupplier] = useState(null); // State for selected supplier
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("categories"); // State to control active section

  const BASE_URL = "http://localhost:8000/api";

  useEffect(() => {
    fetchCategories();
    fetchDishes();
    fetchSuppliers();
    fetchInventoryItems();
  }, []);

  // Fetch existing categories from the API
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/category/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (Array.isArray(result.data)) {
          setCategories(result.data);
        } else {
          setCategories([]);
        }
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      setError("Could not fetch categories, please try again later.");
    }
  };

  // Fetch existing dishes from the API
  const fetchDishes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/dish/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (Array.isArray(result.data)) {
          setDishes(result.data);
        } else {
          setDishes([]);
        }
      } else {
        throw new Error("Failed to fetch dishes");
      }
    } catch (error) {
      setError("Could not fetch dishes, please try again later.");
    }
  };

  // Fetch existing suppliers from the API
  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/supplier/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (Array.isArray(result.data)) {
          setSuppliers(result.data);
        } else {
          setSuppliers([]);
        }
      } else {
        throw new Error("Failed to fetch suppliers");
      }
    } catch (error) {
      setError("Could not fetch suppliers, please try again later.");
    }
  };

  // Fetch existing inventory items from the API
  const fetchInventoryItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/inventory/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (Array.isArray(result.data)) {
          setInventoryItems(result.data);
        } else {
          setInventoryItems([]);
        }
      } else {
        throw new Error("Failed to fetch inventory items");
      }
    } catch (error) {
      setError("Could not fetch inventory items, please try again later.");
    }
  };

  // Add a new category
  const handleAddCategory = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const requestBody = {
      name: newCategory,
      quantity: newCategoryQuantity,
      user_id: userId,
    };

    try {
      const response = await fetch(`${BASE_URL}/category/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(
          `Failed to create category: ${JSON.stringify(responseData)}`
        );
      }

      setNewCategory("");
      fetchCategories();
    } catch (error) {
      setError("Failed to create category. Please try again.");
    }
  };

  // Add a new dish
  const handleAddDish = async () => {
    const { name, categoryId, quantity, price } = newDish;

    if (!name.trim() || !categoryId || !price) {
      setError("Dish name, category, and price must be specified.");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const requestBody = {
      name,
      category_id: categoryId,
      quantity,
      price,
      user_id: userId,
    };

    try {
      const response = await fetch(`${BASE_URL}/dish/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        fetchDishes();
        setNewDish({ name: "", categoryId: "", quantity: 1, price: "" });
      } else {
        const responseText = await response.text();
        throw new Error(`Failed to create dish: ${responseText}`);
      }
    } catch (error) {
      setError("Could not add dish, please try again.");
    }
  };

  // Add a new supplier
  const handleAddSupplier = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!newSupplier.trim()) {
      setError("Supplier name must be specified.");
      return;
    }

    const requestBody = {
      name: newSupplier,
      user_id: userId,
    };

    try {
      const response = await fetch(`${BASE_URL}/supplier/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        fetchSuppliers();
        setNewSupplier("");
      } else {
        const responseText = await response.text();
        throw new Error(`Failed to create supplier: ${responseText}`);
      }
    } catch (error) {
      setError("Could not add supplier, please try again.");
    }
  };

  // Add a new inventory item
  const handleAddInventory = async () => {
    console.log("Add Inventory Button Clicked");

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    console.log("New Inventory Data: ", newInventory);
    console.log("Selected Supplier:", selectedSupplier); // Ensure this has the right structure

    if (
      !newInventory.name.trim() ||
      !newInventory.quantity ||
      !newInventory.expiry ||
      !selectedSupplier
    ) {
      console.log("Validation failed: missing required fields.");
      setError(
        "Inventory name, quantity, expiry date, and supplier must be specified."
      );
      return;
    }

    const requestBody = {
      name: newInventory.name,
      quantity: newInventory.quantity,
      expiry: newInventory.expiry,
      user_id: userId,
    };

    try {
      const response = await fetch(`${BASE_URL}/inventory/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (response.ok) {
        const inventoryId =
          responseData.id || responseData.data?.id || responseData.inventoryId;
        console.log("Inventory ID:", inventoryId);

        if (!inventoryId) {
          throw new Error("Inventory ID is not returned");
        }

        // Ensure the selected supplier value is correct
        const supplierId = selectedSupplier.value; // Ensure this has the right format
        console.log("Attaching Supplier ID:", supplierId);

        // Attach the supplier to the newly created inventory
        await attachSupplierToInventory(inventoryId, supplierId);

        fetchInventoryItems(); // Refresh inventory items after successful addition
        setNewInventory({ name: "", quantity: 1, expiry: "" });
        setSelectedSupplier(null); // Reset selected supplier
      } else {
        const responseText = await response.text();
        throw new Error(`Failed to create inventory item: ${responseText}`);
      }
    } catch (error) {
      console.error("Error in adding inventory or attaching supplier:", error);
      setError(
        "Could not add inventory item and attach supplier, please try again."
      );
    }
  };

  // Function to attach supplier to inventory
  const attachSupplierToInventory = async (inventoryId, supplierId) => {
    const token = localStorage.getItem("token");

    // Ensure supplierId is logged for debugging
    console.log("Attaching Supplier ID:", supplierId);

    try {
      const response = await fetch(
        `${BASE_URL}/inventory_supplier/inventories/${inventoryId}/suppliers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({ supplier_ids: [supplierId] }), // Adjust this based on API requirements
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to attach supplier:", errorText); // Log error response
        throw new Error(`Failed to attach supplier: ${errorText}`);
      }

      console.log("Supplier attached successfully!");
    } catch (error) {
      console.error("Error attaching supplier to inventory:", error);
      throw error; // Rethrow to handle further up in the call chain
    }
  };

  // Function to delete inventory item
  const handleDeleteInventory = async (id) => {
    try {
      // First, get supplier IDs associated with the inventory to detach
      const supplierIds = await getSupplierIdsForInventory(id);
      if (supplierIds.length > 0) {
        await detachSupplierFromInventory(id, supplierIds); // Detach suppliers if any exist
      } else {
        console.warn("No Supplier IDs found for detachment.");
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/inventory/destroy/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        fetchInventoryItems(); // Refresh inventory after deletion
      } else {
        throw new Error("Failed to delete inventory item");
      }
    } catch (error) {
      setError("Could not delete inventory item, please try again.");
      console.error("Error when deleting inventory:", error);
    }
  };

  // Function to detach supplier from inventory
  const detachSupplierFromInventory = async (inventoryId, supplierIds) => {
    const token = localStorage.getItem("token");

    if (!supplierIds || supplierIds.length === 0) {
      console.warn("No Supplier IDs provided for detachment.");
      return; // Exit if no supplier IDs are available
    }

    const body = JSON.stringify({ supplier_ids: supplierIds });

    try {
      const response = await fetch(
        `${BASE_URL}/inventory_supplier/inventories/${inventoryId}/suppliers`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: body,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to detach supplier from inventory: ${errorText}`
        );
      }

      console.log("Suppliers detached successfully!");
    } catch (error) {
      setError("Could not detach supplier from inventory, please try again.");
      console.error("Error in detaching suppliers from inventory:", error);
    }
  };

  // Function to get supplier IDs for a specific inventory
  // Function to get supplier IDs for a specific inventory item
  const getSupplierIdsForInventory = async (inventoryId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${BASE_URL}/inventory_supplier/inventories/${inventoryId}/suppliers`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Check the structure of your data
        if (data && data.data && Array.isArray(data.data)) {
          // Assuming each entry contains a supplier object with an id
          return data.data.map((supplier) => supplier.id); // Ensure this matches your API's response structure
        } else {
          console.warn("No suppliers returned in response data:", data);
          return []; // Return empty if the expected structure is not found
        }
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch supplier IDs:", errorText);
        return []; // Log error and return empty array on failed response
      }
    } catch (error) {
      console.error("Error fetching supplier IDs:", error);
      return []; // Return empty array on error catching
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/category/destroy/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        fetchCategories();
      } else {
        throw new Error("Failed to delete category");
      }
    } catch (error) {
      setError("Could not delete category, please try again.");
    }
  };

  const handleDeleteDish = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/dish/destroy/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        fetchDishes();
      } else {
        throw new Error("Failed to delete dish");
      }
    } catch (error) {
      setError("Could not delete dish, please try again.");
    }
  };

  const handleDeleteSupplier = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/supplier/destroy/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        fetchSuppliers();
      } else {
        throw new Error("Failed to delete supplier");
      }
    } catch (error) {
      setError("Could not delete supplier, please try again.");
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "categories":
        return (
          <section className="cat-section">
            <h2>Manage Categories</h2>
            <h3>Existing Categories</h3>
            <ul>
              {categories.map((category) => (
                <li key={category.id}>
                  {category.name}
                  <button onClick={() => handleDeleteCategory(category.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <h2>Enter a new Category</h2>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New Category"
            />
            <h4>Enter Quantity</h4>
            <input
              type="number"
              value={newCategoryQuantity}
              min="1"
              onChange={(e) => setNewCategoryQuantity(e.target.value)}
              placeholder="Quantity"
            />
            <button onClick={handleAddCategory}>Add Category</button>
          </section>
        );
      case "dishes":
        return (
          <section className="dish-section">
            <h2>Manage Dishes</h2>
            <h3>Existing Dishes</h3>
            <ul>
              {dishes.map((dish) => (
                <li key={dish.id}>
                  {dish.name} (Category: {dish.category.name}){" "}
                  <button onClick={() => handleDeleteDish(dish.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <h3>Add a new Dish</h3>
            <input
              type="text"
              value={newDish.name}
              placeholder="Dish Name"
              onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
            />
            <select
              value={newDish.categoryId}
              onChange={(e) =>
                setNewDish({ ...newDish, categoryId: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <h4>Enter Quantity</h4>
            <input
              type="number"
              value={newDish.quantity}
              min="1"
              onChange={(e) =>
                setNewDish({ ...newDish, quantity: e.target.value })
              }
              placeholder="Quantity"
            />
            <h4>Enter Price</h4>
            <input
              type="number"
              value={newDish.price}
              min="0"
              onChange={(e) =>
                setNewDish({ ...newDish, price: e.target.value })
              }
              placeholder="Price"
            />
            <button onClick={handleAddDish}>Add Dish</button>
          </section>
        );
      case "suppliers":
        return (
          <section className="supplier-section">
            <h2>Manage Suppliers</h2>
            <h3>Existing Suppliers</h3>
            <ul>
              {suppliers.map((supplier) => (
                <li key={supplier.id}>
                  {supplier.name}
                  <button onClick={() => handleDeleteSupplier(supplier.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <h4>Add a supplier</h4>
            <input
              type="text"
              value={newSupplier}
              onChange={(e) => setNewSupplier(e.target.value)}
              placeholder="New Supplier"
            />
            <button onClick={handleAddSupplier}>Add Supplier</button>
          </section>
        );
      case "inventory":
        return (
          <section className="inventory-section">
            <h2>Manage Inventory</h2>
            <h3>Existing Inventory Items</h3>
            <ul>
              {inventoryItems.map((item) => (
                <li key={item.id}>
                  {item.name}
                  <button onClick={() => handleDeleteInventory(item.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <h3>Add a new Inventory Item</h3>
            <input
              type="text"
              value={newInventory.name}
              onChange={(e) =>
                setNewInventory({ ...newInventory, name: e.target.value })
              }
              placeholder="Inventory Name"
            />
            <h4>Enter a Quantity</h4>
            <input
              type="number"
              value={newInventory.quantity}
              min="1"
              onChange={(e) =>
                setNewInventory({ ...newInventory, quantity: e.target.value })
              }
              placeholder="Quantity"
            />
            <h4>Enter Expiry Date</h4>
            <input
              type="date"
              value={newInventory.expiry}
              onChange={(e) =>
                setNewInventory({ ...newInventory, expiry: e.target.value })
              }
            />
            <h4>Select a Supplier</h4>
            <Select
              className="supplier-select"
              options={suppliers.map((supplier) => ({
                value: supplier.id,
                label: supplier.name,
              }))}
              onChange={setSelectedSupplier}
              placeholder="Choose a supplier..."
              isClearable
            />
            <button onClick={handleAddInventory}>Add Inventory</button>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Page</h1>
      {error && <p className="error">{error}</p>}

      <nav className="navbar">
        <button onClick={() => setActiveSection("categories")}>
          Categories
        </button>
        <button onClick={() => setActiveSection("dishes")}>Dishes</button>
        <button onClick={() => setActiveSection("suppliers")}>Suppliers</button>
        <button onClick={() => setActiveSection("inventory")}>Inventory</button>
      </nav>

      {renderActiveSection()}
    </div>
  );
};

export default AdminPage;
