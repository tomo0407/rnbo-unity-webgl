using UnityEngine;
using System.Runtime.InteropServices;

public class RNBOController : MonoBehaviour
{
    public static RNBOController Instance { get; private set; }

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
        }
        else
        {
            Destroy(gameObject);
        }
    }

    [DllImport("__Internal")]
    private static extern void initializeRNBO();

    [DllImport("__Internal")]
    private static extern void setParameter(string paramName, float value);

    [DllImport("__Internal")]
    private static extern void sendMIDIMessage(byte status, byte data1, byte data2);

    void Start()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
            initializeRNBO();
#else
        Debug.Log("Non-WebGL environments: skip RNBO initialization.");
#endif
    }

    public static void SetRNBOParameter(string paramName, float value)
    {
#if UNITY_WEBGL && !UNITY_EDITOR
            setParameter(paramName, value);
#else
        Debug.Log($"Non-WebGL environments: Set parameter {paramName} to {value}.");
#endif
    }

    public static void SendRNBOMIDIMessage(byte status, byte data1, byte data2)
    {
#if UNITY_WEBGL && !UNITY_EDITOR
            sendMIDIMessage(status, data1, data2);
#else
        Debug.Log($"Non-WebGL environments: Send MIDI messages - Status: {status}, Data1: {data1}, Data2: {data2}");
#endif
    }
}