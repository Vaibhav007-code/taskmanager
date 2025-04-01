import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Platform,
  Animated,
  Easing,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Keyboard,
  StatusBar,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Initialize notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Constants
const { width, height } = Dimensions.get('window');
const CATEGORIES = [
  { id: 'work', name: 'Work', icon: 'briefcase', color: '#FF7043' },
  { id: 'personal', name: 'Personal', icon: 'person', color: '#42A5F5' },
  { id: 'shopping', name: 'Shopping', icon: 'cart', color: '#66BB6A' },
  { id: 'health', name: 'Health', icon: 'fitness-center', color: '#EC407A' },
];

const PRIORITIES = [
  { id: 'low', name: 'Low', color: '#66BB6A' },
  { id: 'medium', name: 'Medium', color: '#FFA726' },
  { id: 'high', name: 'High', color: '#EF5350' },
];

// Custom Date Picker Component
const CustomDatePicker = ({ visible, currentDate, onConfirm, onCancel }) => {
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());
  const [selectedHour, setSelectedHour] = useState(currentDate.getHours());
  const [selectedMinute, setSelectedMinute] = useState(currentDate.getMinutes());
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    const date = new Date(currentDate);
    setSelectedYear(date.getFullYear());
    setSelectedMonth(date.getMonth());
    setSelectedDay(date.getDate());
    setSelectedHour(date.getHours());
    setSelectedMinute(date.getMinutes());
  }, [currentDate]);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  useEffect(() => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [selectedYear, selectedMonth]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear + i);
  const yearItems = years.map(year => ({ label: year.toString(), value: year }));

  const months = [
    { label: 'January', value: 0 },
    { label: 'February', value: 1 },
    { label: 'March', value: 2 },
    { label: 'April', value: 3 },
    { label: 'May', value: 4 },
    { label: 'June', value: 5 },
    { label: 'July', value: 6 },
    { label: 'August', value: 7 },
    { label: 'September', value: 8 },
    { label: 'October', value: 9 },
    { label: 'November', value: 10 },
    { label: 'December', value: 11 },
  ];

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const dayItems = Array.from({ length: daysInMonth }, (_, i) => ({
    label: (i + 1).toString(),
    value: i + 1,
  }));

  const hours = Array.from({ length: 24 }, (_, i) => ({
    label: i.toString().padStart(2, '0'),
    value: i,
  }));

  const minutes = Array.from({ length: 60 }, (_, i) => ({
    label: i.toString().padStart(2, '0'),
    value: i,
  }));

  const handleConfirm = () => {
    const selectedDate = new Date(
      selectedYear,
      selectedMonth,
      selectedDay,
      selectedHour,
      selectedMinute
    );
    onConfirm(selectedDate);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.datePickerOverlay} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[styles.datePickerContainer, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.datePickerHeader}>
          <Text style={styles.datePickerTitle}>Select Date & Time</Text>
        </View>
        <View style={styles.datePickerBody}>
          <Text style={styles.datePickerLabel}>Date</Text>
          <View style={styles.pickerRow}>
            <Picker
              style={styles.yearPicker}
              selectedValue={selectedYear}
              onValueChange={setSelectedYear}
            >
              {yearItems.map(item => (
                <Picker.Item key={item.value} label={item.label} value={item.value} />
              ))}
            </Picker>
            <Picker
              style={styles.monthPicker}
              selectedValue={selectedMonth}
              onValueChange={setSelectedMonth}
            >
              {months.map(item => (
                <Picker.Item key={item.value} label={item.label} value={item.value} />
              ))}
            </Picker>
            <Picker
              style={styles.dayPicker}
              selectedValue={selectedDay}
              onValueChange={setSelectedDay}
            >
              {dayItems.map(item => (
                <Picker.Item key={item.value} label={item.label} value={item.value} />
              ))}
            </Picker>
          </View>
          <Text style={styles.datePickerLabel}>Time</Text>
          <View style={styles.pickerRow}>
            <Picker
              style={styles.hourPicker}
              selectedValue={selectedHour}
              onValueChange={setSelectedHour}
            >
              {hours.map(item => (
                <Picker.Item key={item.value} label={item.label} value={item.value} />
              ))}
            </Picker>
            <Picker
              style={styles.minutePicker}
              selectedValue={selectedMinute}
              onValueChange={setSelectedMinute}
            >
              {minutes.map(item => (
                <Picker.Item key={item.value} label={item.label} value={item.value} />
              ))}
            </Picker>
          </View>
          <View style={styles.datePickerControls}>
            <TouchableOpacity
              style={[styles.datePickerControlButton, { backgroundColor: '#f5f5f5' }]}
              onPress={handleCancel}
            >
              <Text style={[styles.datePickerControlText, { color: '#333' }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.datePickerControlButton, { backgroundColor: '#42A5F5' }]}
              onPress={handleConfirm}
            >
              <Text style={[styles.datePickerControlText, { color: '#fff' }]}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default function App() {
  // Rest of the component remains the same
  // State management
  const [task, setTask] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedPriority, setSelectedPriority] = useState(PRIORITIES[1]);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Request notification permissions on app start
  useEffect(() => {
    async function configureNotifications() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'You need to enable notifications for reminders!');
      }
    }
    configureNotifications();
  }, []);

  // Initialize animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Schedule notification
  const scheduleNotification = async (taskText, selectedDate) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ ${selectedPriority.name} Priority Task!`,
          body: `${selectedCategory.name}: ${taskText}`,
          sound: 'default',
          color: selectedCategory.color,
        },
        trigger: {
          date: selectedDate,
        },
      });
    } catch (error) {
      console.error('Notification scheduling error:', error);
      Alert.alert('Error', 'Failed to schedule notification');
    }
  };

  // Add new task
  const addTask = () => {
    if (!task.trim()) {
      Alert.alert('Error', 'Please enter a task description');
      return;
    }

    Keyboard.dismiss();

    const newTask = {
      id: Date.now().toString(),
      text: task,
      time: date,
      category: selectedCategory,
      priority: selectedPriority,
      completed: false,
    };

    scheduleNotification(task, date);
    setTasks([...tasks, newTask]);
    setTask('');
    setDate(new Date());
  };

  // Handle date confirmation
  const handleDateConfirm = (selectedDate) => {
    setDate(selectedDate);
    setShowDatePicker(false);
  };

  // Toggle task completion
  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Delete task with confirmation
  const deleteTask = (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTasks(tasks.filter(task => task.id !== taskId));
            Notifications.cancelScheduledNotificationAsync(taskId)
              .catch(error => console.error('Error cancelling notification:', error));
          },
        },
      ]
    );
  };

  // Render task item
  const renderTaskItem = ({ item }) => (
    <Animated.View
      style={[
        styles.taskItemContainer,
        { opacity: fadeAnim },
      ]}
    >
      <TouchableOpacity
        style={styles.taskCheckbox}
        onPress={() => toggleTaskCompletion(item.id)}
      >
        <Ionicons
          name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={item.completed ? '#66BB6A' : '#ccc'}
        />
      </TouchableOpacity>

      <View
        style={[
          styles.taskItem,
          { borderLeftColor: item.category.color },
        ]}
      >
        <View style={styles.taskHeader}>
          <View
            style={[
              styles.categoryTag,
              { backgroundColor: item.category.color },
            ]}
          >
            <Ionicons
              name={item.category.icon}
              size={16}
              color="#fff"
            />
            <Text style={styles.categoryText}>{item.category.name}</Text>
          </View>
          <View
            style={[
              styles.priorityTag,
              { backgroundColor: item.priority.color },
            ]}
          >
            <Text style={styles.priorityText}>{item.priority.name}</Text>
          </View>
        </View>

        <Text
          style={[
            styles.taskText,
            item.completed && styles.completedTask,
          ]}
        >
          {item.text}
        </Text>

        <View style={styles.taskFooter}>
          <Ionicons name="time" size={14} color="#666" />
          <Text style={styles.taskTime}>
            {item.time.toLocaleString([], {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTask(item.id)}
      >
        <MaterialIcons name="delete" size={24} color="#EF5350" />
      </TouchableOpacity>
    </Animated.View>
  );

  // Render category picker modal
  const renderCategoryPicker = () => (
    <Modal
      transparent={true}
      visible={showCategoryPicker}
      onRequestClose={() => setShowCategoryPicker(false)}
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={() => setShowCategoryPicker(false)}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Select Category</Text>
        {CATEGORIES.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.modalOption,
              { backgroundColor: category.color },
            ]}
            onPress={() => {
              setSelectedCategory(category);
              setShowCategoryPicker(false);
            }}
          >
            <Ionicons name={category.icon} size={20} color="#fff" />
            <Text style={styles.modalOptionText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );

  // Render priority picker modal
  const renderPriorityPicker = () => (
    <Modal
      transparent={true}
      visible={showPriorityPicker}
      onRequestClose={() => setShowPriorityPicker(false)}
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={() => setShowPriorityPicker(false)}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Select Priority</Text>
        {PRIORITIES.map(priority => (
          <TouchableOpacity
            key={priority.id}
            style={[
              styles.modalOption,
              { backgroundColor: priority.color },
            ]}
            onPress={() => {
              setSelectedPriority(priority);
              setShowPriorityPicker(false);
            }}
          >
            <Text style={styles.modalOptionText}>{priority.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );

  return (
    <LinearGradient
      colors={['#E0F2FE', '#F8FAFC']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.title}>🚀 Task Manager Pro</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="What needs to be done?"
            placeholderTextColor="#aaa"
            value={task}
            onChangeText={setTask}
            onSubmitEditing={addTask}
            returnKeyType="done"
          />

          <View style={styles.selectionRow}>
            <TouchableOpacity
              style={[
                styles.categorySelector,
                { backgroundColor: selectedCategory.color },
              ]}
              onPress={() => {
                setShowDatePicker(false);
                setShowPriorityPicker(false);
                setShowCategoryPicker(true);
              }}
            >
              <Ionicons
                name={selectedCategory.icon}
                size={20}
                color="#fff"
              />
              <Text style={styles.selectionText}>{selectedCategory.name}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.prioritySelector,
                { backgroundColor: selectedPriority.color },
              ]}
              onPress={() => {
                setShowDatePicker(false);
                setShowCategoryPicker(false);
                setShowPriorityPicker(true);
              }}
            >
              <Text style={styles.selectionText}>{selectedPriority.name}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setShowCategoryPicker(false);
              setShowPriorityPicker(false);
              setShowDatePicker(true);
            }}
          >
            <Ionicons name="calendar" size={24} color="#4B5563" />
            <Text style={styles.dateText}>
              {date.toLocaleString([], {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={addTask}
          >
            <Text style={styles.buttonText}>Add Task</Text>
            <Ionicons name="add-circle" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {tasks.length > 0 ? (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={renderTaskItem}
            contentContainerStyle={styles.taskList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-circle" size={60} color="rgba(107, 114, 128, 0.3)" />
            <Text style={styles.emptyStateText}>No tasks yet. Add one to get started!</Text>
          </View>
        )}
      </Animated.View>

      {renderCategoryPicker()}
      {renderPriorityPicker()}

      <CustomDatePicker
        visible={showDatePicker}
        currentDate={date}
        onConfirm={handleDateConfirm}
        onCancel={() => setShowDatePicker(false)}
      />
    </LinearGradient>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  input: {
    height: 50,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#1F2937',
  },
  selectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  prioritySelector: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  selectionText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  dateText: {
    color: '#4B5563',
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  taskList: {
    paddingBottom: 20,
  },
  taskItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  taskCheckbox: {
    padding: 10,
  },
  taskItem: {
    flex: 1,
    padding: 5,
    borderRadius: 5,
    borderLeftWidth: 5,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '600',
  },
  priorityTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#1F2937',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTime: {
    color: '#6B7280',
    fontSize: 12,
    marginLeft: 4,
  },
  deleteButton: {
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#1F2937',
  },
  modalOption: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  modalOptionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  datePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  datePickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: height * 0.4,
  },
  datePickerHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 15,
    marginBottom: 15,
  },
  datePickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937',
  },
  datePickerBody: {
    flex: 1,
  },
  datePickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2937',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  yearPicker: {
    width: 100,
  },
  monthPicker: {
    width: 120,
  },
  dayPicker: {
    width: 80,
  },
  hourPicker: {
    width: 80,
  },
  minutePicker: {
    width: 80,
  },
  datePickerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  datePickerControlButton: {
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  datePickerControlText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },
  emptyStateText: {
    color: '#6B7280',
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
  },
});