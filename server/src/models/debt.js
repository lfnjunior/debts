const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const DebtSchema = new mongoose.Schema(
  {
    clientId: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false }
);

DebtSchema.plugin(AutoIncrement, {
  inc_field: "idDebt",
  reference_value: "Debt",
});

module.exports = mongoose.model("Debt", DebtSchema);
