import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gearshape.fill" md="settings" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="ui-test">
        <NativeTabs.Trigger.Label>UI Test</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="apple.logo" md="settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
