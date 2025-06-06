#!/bin/bash

# Function to start a service
start_service() {
    local service_dir=$1
    local service_name=$(basename "$service_dir")
    
    echo "Starting $service_name..."
    cd "$service_dir"
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies for $service_name..."
        npm install
    fi
    
    # Start the service in the background
    npm start &
    
    # Return to the root directory
    cd - > /dev/null
}

# Start all services
echo "Starting all services..."

# Start MCP Gateway first
start_service "services/mcp-gateway"

# Start other services
start_service "services/contacts-service"
start_service "services/tickets-service"
start_service "services/kb-service"

echo "All services started!"
echo "Frontend is available at: http://localhost:3000"
echo "Press Ctrl+C to stop all services" 