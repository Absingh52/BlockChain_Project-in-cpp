#pragma once
#include <string>
#include <vector>
#include <map>
#include <memory>
#include <sstream>
#include <iomanip>
#include <stdexcept>
#include <cmath>

namespace nlohmann {

class json {
public:
    enum Type { Null, Bool, Number, String, Array, Object };
    
private:
    Type type;
    bool boolValue;
    double numberValue;
    std::string stringValue;
    std::vector<json> arrayValue;
    std::map<std::string, json> objectValue;
    
public:
    json() : type(Null), boolValue(false), numberValue(0.0) {}
    json(bool b) : type(Bool), boolValue(b), numberValue(0.0) {}
    json(int i) : type(Number), boolValue(false), numberValue(static_cast<double>(i)) {}
    json(double d) : type(Number), boolValue(false), numberValue(d) {}
    json(const std::string& s) : type(String), boolValue(false), numberValue(0.0), stringValue(s) {}
    json(const char* s) : type(String), boolValue(false), numberValue(0.0), stringValue(s) {}
    
    static json array() {
        json j;
        j.type = Array;
        return j;
    }
    
    static json object() {
        json j;
        j.type = Object;
        return j;
    }
    
    static json parse(const std::string& str) {
        // Simple JSON parser for basic types
        json result;
        // For now, return empty object - this is just a placeholder
        result.type = Object;
        
        // Parse very basic JSON manually
        size_t pos = 0;
        if (str.find("{") != std::string::npos) {
            result = parseObject(str, pos);
        }
        return result;
    }
    
    void push_back(const json& j) {
        if (type != Array) type = Array;
        arrayValue.push_back(j);
    }
    
    json& operator[](const std::string& key) {
        if (type != Object) type = Object;
        return objectValue[key];
    }
    
    json& operator[](size_t index) {
        if (type != Array) type = Array;
        if (index >= arrayValue.size()) {
            arrayValue.resize(index + 1);
        }
        return arrayValue[index];
    }
    
    std::string dump() const {
        return toString();
    }
    
private:
    std::string toString() const {
        switch (type) {
            case Null:
                return "null";
            case Bool:
                return boolValue ? "true" : "false";
            case Number: {
                // Check if it's an integer
                if (numberValue == std::floor(numberValue)) {
                    return std::to_string(static_cast<long long>(numberValue));
                } else {
                    std::ostringstream oss;
                    oss << std::fixed << std::setprecision(2) << numberValue;
                    return oss.str();
                }
            }
            case String: {
                std::string escaped;
                for (char c : stringValue) {
                    if (c == '"') escaped += "\\\"";
                    else if (c == '\\') escaped += "\\\\";
                    else if (c == '\n') escaped += "\\n";
                    else if (c == '\r') escaped += "\\r";
                    else if (c == '\t') escaped += "\\t";
                    else escaped += c;
                }
                return "\"" + escaped + "\"";
            }
            case Array: {
                std::string result = "[";
                for (size_t i = 0; i < arrayValue.size(); i++) {
                    result += arrayValue[i].toString();
                    if (i < arrayValue.size() - 1) result += ",";
                }
                result += "]";
                return result;
            }
            case Object: {
                std::string result = "{";
                bool first = true;
                for (const auto& pair : objectValue) {
                    if (!first) result += ",";
                    result += "\"" + pair.first + "\":" + pair.second.toString();
                    first = false;
                }
                result += "}";
                return result;
            }
        }
        return "";
    }
    
    static json parseObject(const std::string& str, size_t& pos);
};

inline json json::parseObject(const std::string& str, size_t& pos) {
    json result;
    result.type = Object;
    
    while (pos < str.length() && str[pos] != '}') {
        if (str[pos] == '"') {
            pos++;
            std::string key;
            while (pos < str.length() && str[pos] != '"') {
                key += str[pos++];
            }
            pos++; // skip closing quote
            
            while (pos < str.length() && str[pos] != ':') pos++;
            pos++; // skip colon
            
            // Parse value
            while (pos < str.length() && (str[pos] == ' ' || str[pos] == '\n')) pos++;
            
            json value;
            if (str[pos] == '"') {
                pos++;
                std::string val;
                while (pos < str.length() && str[pos] != '"') {
                    val += str[pos++];
                }
                pos++;
                value = json(val);
            } else if (str[pos] == '{') {
                value = parseObject(str, ++pos);
            } else if (str[pos] == '[') {
                value.type = Array;
                pos++;
                while (pos < str.length() && str[pos] != ']') {
                    if (str[pos] == '"') {
                        pos++;
                        std::string val;
                        while (pos < str.length() && str[pos] != '"') val += str[pos++];
                        pos++;
                        value.arrayValue.push_back(json(val));
                    } else if (str[pos] == '{') {
                        value.arrayValue.push_back(parseObject(str, ++pos));
                    } else {
                        pos++;
                    }
                    while (pos < str.length() && (str[pos] == ',' || str[pos] == ' ')) pos++;
                }
                pos++;
            } else {
                // Parse number or boolean
                std::string numStr;
                while (pos < str.length() && str[pos] != ',' && str[pos] != '}' && str[pos] != ']') {
                    numStr += str[pos++];
                }
                if (numStr == "true") value = json(true);
                else if (numStr == "false") value = json(false);
                else if (numStr == "null") value = json();
                else {
                    try {
                        value = json(std::stod(numStr));
                    } catch (...) {
                        value = json(numStr);
                    }
                }
            }
            
            result.objectValue[key] = value;
        }
        pos++;
    }
    if (pos < str.length()) pos++; // skip closing brace
    return result;
}

} // namespace nlohmann
