#!/usr/bin/env bash

# Default program ID used for testing
PROGRAM_ID="a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"

# Docker compose command to produce messages
PRODUCER_CMD="docker compose exec -T kafka rpk topic produce"

echo "=========================================="
echo "    Kafka / Redpanda Event Test Utility   "
echo "=========================================="
echo "Select an event to send:"
echo "1) INVOICE_RESERVED     (Reserve capacity)"
echo "2) INVOICE_RELEASED     (Release capacity)"
echo "3) CAPACITY_UPDATED     (Update program total capacity)"
echo "4) BULK_RECONCILIATION  (Bulk reconciliation)"
echo "=========================================="
read -p "Choice [1-4]: " CHOICE

case $CHOICE in
  1)
    TOPIC="treasury.invoice.reserved"
    INVOICE_ID="INV-TEST-$(date +%s)"
    PAYLOAD=$(cat <<EOF
{
  "programId": "$PROGRAM_ID",
  "invoiceId": "$INVOICE_ID",
  "amount": 50000,
  "currency": "EUR"
}
EOF
    )
    echo -e "\n--> Sending invoice reservation $INVOICE_ID to topic $TOPIC..."
    ;;

  2)
    TOPIC="treasury.invoice.released"
    read -p "Enter invoiceId to release [default: INV-TEST-12345]: " INVOICE_INPUT
    INVOICE_ID=${INVOICE_INPUT:-"INV-TEST-12345"}
    PAYLOAD=$(cat <<EOF
{
  "invoiceId": "$INVOICE_ID",
  "repaymentReference": "REF-PAYMENT-$(date +%s)"
}
EOF
    )
    echo -e "\n--> Sending invoice release $INVOICE_ID to topic $TOPIC..."
    ;;

  3)
    TOPIC="treasury.capacity.updated"
    PAYLOAD=$(cat <<EOF
{
  "programId": "$PROGRAM_ID",
  "totalCapacity": 15000000,
  "currency": "USD"
}
EOF
    )
    echo -e "\n--> Sending capacity update to topic $TOPIC..."
    ;;

  4)
    TOPIC="treasury.reconciliation.requested"
    PAYLOAD=$(cat <<EOF
{
  "programId": "$PROGRAM_ID",
  "totalCapacity": 10000000,
  "activeInvoices": [
    { "invoiceId": "INV-REC-001", "amount": 100000, "currency": "USD" },
    { "invoiceId": "INV-REC-002", "amount": 50000, "currency": "EUR" }
  ]
}
EOF
    )
    echo -e "\n--> Sending BULK_RECONCILIATION event to topic $TOPIC..."
    ;;

  *)
    echo "Invalid choice. Aborting."
    exit 1
    ;;
esac

# Remove newlines so rpk receives the JSON as a single line / single message
SINGLE_LINE_PAYLOAD=$(echo "$PAYLOAD" | tr -d '\r\n')

# Send payload to Redpanda/Kafka
echo "$SINGLE_LINE_PAYLOAD" | $PRODUCER_CMD $TOPIC

if [ $? -eq 0 ]; then
  echo -e "\n[OK] Event successfully sent to Kafka!"
else
  echo -e "\n[ERROR] Failed to send event. Please check if Docker containers are running."
fi
