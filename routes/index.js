router.put("/contacts/:id", async (req, res) => {
    try {
      const { firstName, lastName, email } = req.body;
      if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const contact = await Contact.findByIdAndUpdate(
        req.params.id,
        { firstName, lastName, email },
        { new: true }
      );
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      console.error("Error in PUT /contacts:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  router.delete("/contacts/:id", async (req, res) => {
    try {
      const contact = await Contact.findByIdAndDelete(req.params.id);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json({ message: "Contact deleted" });
    } catch (error) {
      console.error("Error in DELETE /contacts:", error);
      res.status(500).json({ error: "Server error" });
    }
  });